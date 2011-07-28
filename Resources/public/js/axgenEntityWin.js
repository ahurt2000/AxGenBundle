/*
 * Entity windows.   - Ext JS Library 2.2
 * bundle: AxgenBundle 
 * Alejandro Hurtado <ahurt2000@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * 
 */
Ext.ns('AxGen.EntityWin');
AxGen.EntityWin = function(config){
    Ext.apply(this, config);
    this.save_bundle = new Ext.Button({
        text:'Save', 
        iconCls:'adm-icon-save',
        columnWidth:.2, 
        handler:function(){
            this.save();
        }, 
        scope:this
    });
    this.cancel_edit = new Ext.Button({
        text:'Cancel',
        iconCls:'adm-icon-remove',
        columnWidth:.2, 
        handler:function(){
            this.close();
        }, 
        scope:this
    });
 
    Ext.apply(this, {
        bbar:[    
        new Ext.Toolbar.Fill(),
        this.save_bundle,
        this.cancel_edit
        ]
    });    
    
    AxGen.EntityWin.superclass.constructor.call(this);
    this.init();
}

Ext.extend(AxGen.EntityWin, Ext.Window, {
    id:'win-entity-gen',
    layout:'form',
    title:'Entity Generator',
    autoScroll:true,
    modal: true,
    closeAction:'close',
    closable: true,
    bodyStyle:'padding:5px 5px 0',
    width: 400,
    labelWidth: 130,
    init: function(){
        me = this;        
        
        this.comboBundles = new AxGen.Bundles.Combo();
        
        /* cambiar el valor de entity_name segun el valor del combo */
        this.comboBundles.on('select',function(e, op){
            selectedName = e.getValue();
            var idx = this.store.findBy(function(record){
                    if (record.get('name') == selectedName ) {
                            shortname = record.get('short');
                            return true;
                    }
            });
            me.entity_name.setValue(shortname+'/EntityName');            
        });
        
        
        /* only ended with Bundle pattern Acme/xxxBundle  */
        this.entity_name = this.add(new Ext.form.TextField({
            fieldLabel: 'Entity name', 
            name: 'txtEntityName', 
            anchor: '80%',
            blankText: 'something like "Blog/Post"',
            emptyText: 'bundle/Entity',
            allowBlank: false          
        }));
             
        this.entity_format = new AxGen.Formats.Combo({
            fieldLabel: 'Configuration format', 
            name: 'EntityCfgFormat'
        });
        
        this.entity_repository = new Ext.form.Checkbox({
            fieldLabel: 'With repository?',
            name: 'entityRepository',
            id: 'entity_repository',
            anchor: '100%',
            checked: true
        });      
       
        /* doctrine fields types */
        var ftypes_store = new Ext.data.SimpleStore({
            fields: ['dctype','name'],
            data: [
            ["string","String"],
            ["integer","Integer"],
            ["smallint","Smallint"],
            ["bigint","Bigint"],
            ["boolean","Boolean"],
            ["decimal","Decimal"],
            ["date","Date"],
            ["time","Time"],
            ["datetime","Datetime"],
            ["text","Text"],
            ["object","Object"],
            ["array","Array"],
            ["float","Float"]
            ]
        });
        
        fieldTypesCombo = new Ext.form.ComboBox({
            fieldLabel: 'Configuration format', 
            name: 'EntityCfgFormat',
            store: ftypes_store,
            mode:'local',
            triggerAction: 'all',
            displayField: 'name',
            valueField: 'dctype',
            typeAhead: true,
            editable: false,
            selectOnFocus: true,
            forceSelection: true
        });
        
        
        /* grid for fields */
        this.fieldstore = new Ext.data.SimpleStore({
            fields: [
             { 
                 name: 'fieldName' 
             },{ 
                 name: 'type' 
             },{ 
                 name: 'length' 
             }
            ] 
        });
        
        var cmFieldsGrid = new Ext.grid.ColumnModel({
            defaultSortable: false,
            columns: [
            {
                header: "Field name", 
                hidden: false, 
                dataIndex: "fieldName", 
                editor: new Ext.form.TextField({allowBlank:false}),
                sortable: true
            },{
                header: "Type", 
                dataIndex: "type",             
                sortable: true,
                editor: fieldTypesCombo,
                rederer: Ext.ux.renderer.Combo(fieldTypesCombo,'fieldsGrid'),
                width: 40
            },{
                header: "Length", 
                dataIndex: "length", 
                editor: new Ext.form.NumberField({allowBlank:true}),
                width: 25
            },{
                width : 25,
                header: 'action',
                dataIndex : 'delete',
                renderer : function(value, metadata, record) {
                        return '<div class="x-tool x-tool-close">&nbsp;</div>';
                }
            }
            ]
        });
        
        this.fieldsGrid = new Ext.grid.EditorGridPanel({
            title:'Fields definition',
            store: this.fieldstore,
            frame: false,
            width: 380,
            height:200,
            stripeRows: true,
            id: 'fieldsGrid',
            autoScroll : true,
            clicksToEdit: 1,
            autoExpandColumn: 'fieldName',
            viewConfig: {
                emptyText: 'No hay elementos ...',
                sm: new Ext.grid.RowSelectionModel({
                    singleSelect:true
                }),
                forceFit: true
            }, 
            colModel: cmFieldsGrid,
            tbar: [
            {
                xtype:'tbbutton',
                text:'Add', 
                iconCls:'adm-icon-add', 
                handler:function(){
                    var grid = Ext.getCmp('fieldsGrid');
                    var store = grid.getStore();
                    store.loadData([['','string','']], true);
                    grid.startEditing(store.getCount()-1, 0);
                },
                scope:this 
            }
            ]
        });
        this.fieldsGrid.on('cellclick', function(grid, rowIndex, columnIndex, e){
            var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
            if (fieldName == 'delete') {
                    var record = grid.getStore().getAt(rowIndex);      
                    this.delElement(record);
            }    
        },this);
        
        this.delElement = function(pRecord) {
            this.fieldstore.remove(pRecord);
	};
        
        this.add(this.comboBundles);
        this.add(this.entity_name);
        this.add(this.entity_format);
        this.add(this.entity_repository);
        this.add(this.fieldsGrid);

    },
    getFieldsData: function(){
        dataGrid = new Array();
	storeGrid = this.fieldsGrid.getStore();
	storeGrid.data.each( function( registro ){
            index = storeGrid.data.indexOf( registro );
            dataGrid[index] = registro.data;
        });
	if (dataGrid.length == 0) return false;
	return dataGrid;
    },
    save:function(){
        var data
        Ext.Ajax.request({
            url: gen_entity_url,
            method: 'POST',
            params:  {
                'ne_bundle'            : this.comboBundles.getValue(),
                'ne_name'              : this.entity_name.getValue(),
                'ne_format'            : this.entity_format.getValue(),
                'ne_width_repo'        : this.entity_repository.getValue(),
                'ne_entities_data'     : Ext.util.JSON.encode(this.getFieldsData())
            },            
            success: function(objServerResponse){
                var data = Ext.decode(objServerResponse.responseText);
                Ext.MessageBox.alert('Status',data.message);
                if(data.success !== false){
                    this.close();   
                }
                  
            },
            failure:  function(){
                alert("Ajax error! OoH, this should never happen.");
                return false;
            },
            scope: this

                
        });

    }    
});

Ext.reg('axentitywin',AxGen.EntityWin );


