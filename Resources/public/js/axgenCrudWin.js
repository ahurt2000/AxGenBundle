/*
 * CRUD windows.   - Ext JS Library 2.2
 * bundle: AxgenBundle 
 * Alejandro Hurtado <ahurt2000@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * 
 */
Ext.ns('AxGen.CrudWin');
AxGen.CrudWin = function(config){
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
    
    AxGen.CrudWin.superclass.constructor.call(this);
    this.init();
}

Ext.extend(AxGen.CrudWin,Ext.Window, {
    id:'win-crud-gen',
    layout:'form',
    title:'CRUD Generator',
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
        
        /* entity name  */
        this.entity_name = this.add(new Ext.form.TextField({
            fieldLabel: 'Entity name', 
            name: 'txtEntityName', 
            anchor: '100%',
            blankText: 'something like "Post"',
            emptyText: 'Entity name',
            allowBlank: false       
        }));

        this.route_prefix = this.add(new Ext.form.TextField({
            fieldLabel: 'Route prefix', 
            name: 'txtEntityName', 
            anchor: '100%',
            blankText: 'somthing like /post',
            emptyText: 'a prefix like /post',
            allowBlank: false       
        }));
        
        /* write actions checkbox */
        this.write_actions = new Ext.form.Checkbox({
            fieldLabel: 'Write actions?',
            name: 'writeactions',
            id: 'writeactions',
            anchor: '100%',
            checked: false
        });    
        
        /* formats */
        this.config_format = new AxGen.Formats.Combo({
            fieldLabel: 'Configuration format', 
            name: 'CrudCfgFormat'
        });
        
        
        this.route_update = new Ext.form.Checkbox({
            fieldLabel: 'Automatic routing update',
            name: 'bundleRouteUpdate',
            id: 'bdl_route_update',
            anchor: '100%',
            checked: true
        });        
        
        this.add(this.comboBundles);
        this.add(this.entity_name);
        this.add(this.config_format);
        this.add(this.route_prefix);
        this.add(this.write_actions);
        this.add(this.route_update);
        
        
    },
    save:function(){
        var entity = this.comboBundles.getValue()+":"+this.entity_name.getValue();
        Ext.Ajax.request({
            url: gen_crud_url,
            method: 'POST',
            params:  {
                'bundle-name'   : this.comboBundles.getValue(),
                'entity'        : this.entity_name.getValue(),
                'route-prefix'  : this.route_prefix.getValue(),
                'with-write'    : this.write_actions.getValue(),
                'format'        : this.config_format.getValue(),
                'route_update'  : this.route_update.getValue()
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

Ext.reg('axcrudwin', AxGen.CrudWin );