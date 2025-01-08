{
    'name': 'Project Gantt View',
    'version': '1.0',
    'summary': 'Add a Gantt view to project tasks',
    'description': 'Custom Gantt view for project tasks using OWL',
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
            'project_gantt_view/static/src/xml/gantt_view.xml',
            'project_gantt_view/static/css/gantt_style.css',
        ],
    },
    'installable': True,
    'auto_install': False,
    'application': False,
}