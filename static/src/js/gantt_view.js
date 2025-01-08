/** @odoo-module **/

import { registry } from '@web/core/registry';
import { useService } from "@web/core/utils/hooks";
import { Component, onMounted, useState, useRef, onWillStart } from "@odoo/owl";
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
        onWillStart(this.loadGanttData.bind(this));
    }

    async loadGanttData() {
        try {
            this.state.isLoading = true;
            // Cargar datos de tareas desde el modelo 'project.task'
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

    renderGantt() {
        const container = this.ganttContainer.el;
        container.innerHTML = ''; // Limpiar contenedor antes de renderizar

        // Configuración básica del gráfico Gantt
        const taskHeight = 30; // Altura de cada tarea
        const taskMargin = 5; // Espacio entre tareas

        // Calcular la anchura total de la vista (por ejemplo, 1000px)
        const totalWidth = container.clientWidth;

        // Crear un gráfico básico
        this.state.tasks.forEach((task, index) => {
            const taskDiv = document.createElement("div");
            taskDiv.classList.add("gantt-task");

            const taskWidth = this.calculateTaskWidth(task); // Calcula el ancho según las fechas

            taskDiv.style.height = `${taskHeight}px`;
            taskDiv.style.marginTop = `${taskMargin * index}px`;
            taskDiv.style.width = `${taskWidth}px`;
            taskDiv.style.backgroundColor = "#4CAF50";
            taskDiv.style.position = "absolute";
            taskDiv.style.left = `${this.calculateTaskPosition(task)}px`;

            taskDiv.innerHTML = `
                <span class="gantt-task-name">${task.name}</span>
            `;
            container.appendChild(taskDiv);
        });
    }

    // Método para calcular la posición horizontal de la tarea en el gráfico
    calculateTaskPosition(task) {
        const startDate = new Date(task.date_start);
        const minDate = new Date(this.state.tasks[0].date_start); // Considera la primera tarea para el cálculo
        return (startDate - minDate) / (1000 * 60 * 60 * 24) * 50; // 50px por día
    }

    // Método para calcular el ancho de la tarea según su duración
    calculateTaskWidth(task) {
        const startDate = new Date(task.date_start);
        const endDate = new Date(task.date_deadline);
        const duration = (endDate - startDate) / (1000 * 60 * 60 * 24); // Duración en días
        return duration * 50; // 50px por día
    }
}

GanttView.template = "project_gantt_view.GanttViewTemplate";

registry.category("view_widgets").add("project_gantt_view.GanttView", {
    Component: GanttView,
    selector: '.project_gantt_view_container',
});
