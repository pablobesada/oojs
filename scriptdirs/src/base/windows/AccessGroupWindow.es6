"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'AccessGroupWindow',
    inherits: 'MasterWindow',
    record: 'AccessGroup',
    title: "Grupo de Acceso",
    form: [
        {field: 'Code', label: 'Codigo'},
        {
            field: 'RecordsAccessType', editor: 'radiobutton', options: [
            {label: "By Default Without Access", value: 0},
            {label: "By Default With Total Access", value: 1}

        ]
        },
        {
            type: 'tabs', pages: [
            {
                label: "Registros", name: 'Records', content: [
                {
                    field: 'Records', columns: [
                    {field: 'Name'},
                    {
                        field: 'Access', editor: 'combobox', options: [
                        {label: "Allowed", value: 0},
                        {label: "Read Only", value: 1},
                        {label: "View Only", value: 2},
                        {label: "Denied", value: 3},

                    ]
                    },
                    {
                        field: 'Visibility', editor: 'combobox', options: [
                        {label: "All Records", value: 0},
                        {label: "Only Office Records", value: 1},
                        {label: "Only Department Records", value: 3},
                        {label: "Only User Records", value: 2},
                        {label: "Only Assignee Records", value: 4},
                    ]
                    },
                ]
                }
            ]
            },
        ]
        }
    ],
    filename: __filename
}

var Parent = cm.SuperClass(Description)
class AccessGroupWindow extends Parent {
    constructor() {
        super()
    }
}

module.exports = AccessGroupWindow.initClass(Description)