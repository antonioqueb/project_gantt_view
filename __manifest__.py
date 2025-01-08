# manifest.py
{
    'name': 'Project Gantt View',
    'version': '1.0',
    'summary': 'Add a custom Gantt view to project tasks',
    'description': 'A custom Gantt view for project tasks using pure JavaScript',
    'category': 'Project',
    'author': 'Tu Nombre',
    'website': 'Tu Sitio Web',
    'depends': ['project'],
    'data': [
        'views/project_view.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'project_gantt_view/static/src/js/gantt_view.js',
            'project_gantt_view/static/css/gantt_style.css',
            'project_gantt_view/static/src/xml/gantt_view.xml',
            'project_gantt_view/static/lib/dhtmlxgantt.js',
            'project_gantt_view/static/lib/dhtmlxgantt.css',
        ],
    },
    'qweb': [
        'project_gantt_view/static/src/xml/gantt_view.xml',
    ],
    'installable': True,
    'auto_install': False,
    'application': False,
}