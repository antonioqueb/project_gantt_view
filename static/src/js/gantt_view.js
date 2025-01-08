/** @odoo-module */
import { registry } from '@web/core/registry';
import { useService } from "@web/core/utils/hooks";
import { Component, onMounted, useState, useRef } from "@odoo/owl";
import { loadJS } from "@web/core/assets";
import { xml } from "@odoo/owl"; // Import xml

export class GanttView extends Component {
    setup() {
        this.orm = useService("orm");
        this.state = useState({
            tasks: [],
            isLoading: true,
            error: null,
        });
        this.ganttContainer = useRef("gantt-container");
        onMounted(this.loadGanttData.bind(this));
    }
    async loadGanttData() {
        try {
            this.state.isLoading = true;
            const tasks = await this.orm.call("project.task", "search_read", [], {
                fields: ["name", "date_deadline", "date_start"]
            });
            this.state.tasks = tasks;
            this.renderGantt();
        } catch (error) {
            console.error("Error loading data:", error);
            this.state.error = "Error al cargar los datos.";
        } finally {
            this.state.isLoading = false;
        }
    }

    async renderGantt() {
        await loadJS("/project_gantt_view/static/js/dhtmlxgantt.js");
        gantt.init(this.ganttContainer.el);
        gantt.config.date_format = "%Y-%m-%d %H:%i:%s";
        gantt.parse({
            data: this.state.tasks.map(task => ({
                id: task.id,
                text: task.name,
                start_date: task.date_start,
                end_date: task.date_deadline,
                progress: 0.5,
            })),
        });
    }
}

GanttView.template = "project_gantt_view.GanttViewTemplate";
registry.category("views").add("gantt_view_custom", { // Change here
    ...GanttView,
    type: "gantt_view_custom", // Add type
    display_name: "Gantt View",
    icon: "fa fa-tasks",
    extractProps: ({ attrs }) => ({
        ...attrs,
    }),
    // Define the template here
    template: xml`
        <t t-name="project_gantt_view.GanttViewTemplate">
            <div class="gantt-view-container">
                <div t-ref="gantt-container" class="gantt_container" style="width: 100%; height: 600px;"></div>
                <div t-if="state.isLoading">Cargando...</div>
                <div t-if="state.error" t-esc="state.error" class="error-message"/>
            </div>
        </t>
    `,
});