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
            'custom_gantt_view/static/src/js/gantt_view.js',
            'custom_gantt_view/static/css/gantt_style.css',
        ],
    },
    'qweb': [
        'custom_gantt_view/static/src/xml/gantt_view.xml',
    ],
    'installable': True,
    'auto_install': False,
    'application': False,
}
