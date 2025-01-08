/** @odoo-module **/
import { registry } from '@web/core/registry';
import { useService } from '@web/core/utils/hooks';
import { Component, onMounted, useRef, onWillUnmount } from "@odoo/owl";
import { loadJS, loadCSS } from '@web/core/assets';


class GanttView extends Component {
    setup() {
        this.orm = useService('orm');
        this.actionService = useService('action');
        this.ganttRef = useRef('gantt_here');
        this.ganttInstance = null;
        onMounted(this.onMounted.bind(this));
        onWillUnmount(this.onWillUnmount.bind(this));
    }

    async onMounted() {

        await loadJS("/project_gantt_view/static/lib/dhtmlxgantt.js");
        await loadCSS("/project_gantt_view/static/lib/dhtmlxgantt.css");
        
        this.ganttInstance = await this.initGantt();

    }
    onWillUnmount(){
        if(this.ganttInstance){
            this.ganttInstance.destructor();
            this.ganttInstance=null;
        }
    }
    async initGantt() {
        gantt.config.date_format = "%Y-%m-%d %H:%i";
        gantt.init(this.ganttRef.el);
        const tasks = await this.fetchTasks();
        gantt.parse({
            data: tasks.tasks,
            links: tasks.links
        });

        return gantt;

    }

    async fetchTasks() {
        try {
           const tasks = await this.orm.call('project.task','search_read',[],
            ['id','name','date_start','date_deadline','project_id','parent_id','progress']);
            
           const links = await this.orm.call('project.task.dependency','search_read',[],
            ['id','task_id','depends_on_id','type']);
           const ganttTasks = [];
           const ganttLinks = [];
           
           
            tasks.forEach(task => {
            ganttTasks.push({
                id: task.id,
                text: task.name,
                start_date: task.date_start ? task.date_start.replace(' ','T') : null,
                duration: task.date_deadline ?  (new Date(task.date_deadline).getTime() - new Date(task.date_start).getTime())/(1000*60*60*24):null,
                parent: task.parent_id ? task.parent_id[0] : 0,
                progress: task.progress ? task.progress /100 : 0,
                open: true,
              });
           });

           links.forEach(link =>{
              ganttLinks.push({
                id: link.id,
                source:link.task_id[0],
                target:link.depends_on_id[0],
                type: link.type,
              });
           });
            

            return {tasks:ganttTasks, links:ganttLinks};

        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    
}
GanttView.template = 'web_gantt_ce_odoo_17.GanttView';

registry.category('actions').add('action_gantt_view', GanttView);