/** @odoo-module */
import { registry } from '@web/core/registry';
import { useService } from "@web/core/utils/hooks";
import { Component, onMounted, useState, useRef } from "@odoo/owl";
import { loadJS } from "@web/core/assets";

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
registry.category("views").add("gantt_view", GanttView);