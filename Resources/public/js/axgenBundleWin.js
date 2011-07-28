/*
 * Bundle Generator windows.   - Ext JS Library 2.2
 * bundle: AxgenBundle 
 * Alejandro Hurtado <ahurt2000@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * 
 */
Ext.ns('AxGen.BundleWin');
AxGen.BundleWin = function(config){
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
    
    AxGen.BundleWin.superclass.constructor.call(this);
    this.init();
}

Ext.extend(AxGen.BundleWin, Ext.Window, {
    id:'win-bundle-gen',
    layout:'form',
    title:'Bundle Generator',
    autoScroll:true,
    modal: true,
    closeAction:'close',
    closable: true,
    bodyStyle:'padding:5px 5px 0',
    width: 578,
    init: function(){
        me = this;
        
        this.bundle_list = new AxGen.Bundles.List();

        /* value setted to AcmexxxBundle when bundle name is setted */
        this.bundle_namespace = new Ext.form.TextField({
            fieldLabel: 'Namespace', 
            name: 'bundlenamespace',
            allowBlank: false,
            blankText: 'something like Acme/Bundle/BlogBundle',
            emptyText: 'Acme/Bundle/BlogBundle',
            anchor: '100%'
        });
        
        this.bundle_namespace.on('blur', function(e, op){
            namespace = e.getValue();            
            if(namespace.substr(-6)!=='Bundle'){
                Ext.MessageBox.alert('Attention', 'Bundle suffix added');
                namespace +='Bundle';
                e.setValue(namespace);  
            }
            bundlename = namespace.replace(/\/|\\/gi,'');
            me.bundle_name.setValue(bundlename);
        });
        
        
        /* only ended with Bundle pattern Acme/xxxBundle  */
        this.bundle_name = new Ext.form.TextField({
            fieldLabel: 'Bundle name', 
            name: 'txtBundleName', 
            anchor: '100%',
            allowBlank: false          
        });
        
        /* changing directory separators \ by / */
        default_bundle_target_dir = root_dir.replace(/\\/g,'/') + '/src';  
        
        /* Initialized with the default Bundle target directory */
        this.bundle_target_dir = new Ext.form.TextField({
            fieldLabel: 'Target directory', 
            name: 'bundleTargetDir',
            anchor: '100%',
            value: default_bundle_target_dir
        });
      
        this.bundle_format = new AxGen.Formats.Combo({
            fieldLabel: 'Configuration format', 
            name: 'bundleCfgFormat'
        });              
        
        this.bundle_structure = new Ext.form.Checkbox({
            fieldLabel: 'Whole directory structure',
            name: 'bundleDirStruct',
            id: 'bdl_dir_struct',
            anchor: '100%'
        });
        this.bundle_kernel_update = new Ext.form.Checkbox({
            fieldLabel: 'Automatic kernel update',
            name: 'bundleKernelUpdate',
            id: 'bdl_kernel_update',
            anchor: '100%',
            checked: true
        });
        
        this.bundle_route_update = new Ext.form.Checkbox({
            fieldLabel: 'Automatic routing update',
            name: 'bundleRouteUpdate',
            id: 'bdl_route_update',
            anchor: '100%',
            checked: true
        });  
        
        this.add({
            layout:'column',
            items:[
            {
                region:'east',
//                title: 'Registered bundles',
//                collapsible: true,
//                split:true,
                width: 150,
                items: [this.bundle_list ]
            },{
                region:'center',
                title: 'New bundle data',
                collapsible: false,
                bodyStyle: 'background:#DFE8F6;padding: 2px',
                width: 400,
                items:[{                
                   border: false,
                   frame: false,
                   items: [
                       {
                           columnWidth:1,
                           layout: 'form',
                           labelWidth: 120,
                           bodyStyle: 'background:#DFE8F6;padding:5px 2px',
                           items: [ this.bundle_namespace]
                       },{
                            columnWidth:1,
                            layout: 'form', 
                            labelWidth: 120,
                            bodyStyle: 'background:#DFE8F6;padding:5px 2px',
                            items: [this.bundle_name]
                       },{
                            columnWidth:1,
                            layout: 'form',  
                            labelWidth: 120,
                            bodyStyle: 'background:#DFE8F6;padding:5px 2px',
                            items: [this.bundle_target_dir]                         
                       },{
                            columnWidth:1,
                            layout: 'form',   
                            labelWidth: 120,
                            bodyStyle: 'background:#DFE8F6;padding:5px 2px',
                            items: [this.bundle_format]                           
                       },{
                            layout:'column',
                            bodyStyle:'padding:5px;margin:5px 2px',
                            hideBorders: true,
                            items:[{
                                columnWidth:1,
                                layout: 'form',
                                labelWidth: 180,
                                items: [this.bundle_structure]
                            },{
                                columnWidth:1,
                                layout: 'form',
                                labelWidth: 180,
                                items: [this.bundle_kernel_update]  
                            },{
                                columnWidth:1,
                                layout: 'form',
                                labelWidth: 180,
                                items: [this.bundle_route_update]                      
                            }]
                        }
                      ]
                }]
                    
            }
            ]
        });
        

    },
    save:function(){
        Ext.Ajax.request({
            url: gen_url,
            method: 'POST',
            params:  {
                'nb_namespace'     : this.bundle_namespace.getValue(),
                'nb_name'          : this.bundle_name.getValue(),
                'nb_target_dir'    : this.bundle_target_dir.getValue(),
                'nb_format'        : this.bundle_format.getValue(),
                'nb_structure_add'     : this.bundle_structure.getValue(),
                'nb_kernel_update'        : this.bundle_kernel_update.getValue(),
                'nb_route_update'         : this.bundle_route_update.getValue()
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
Ext.reg('axgenwin',AxGen.BundleWin );
//        bundletip = "Each bundle is hosted under a namespace (like Acme/Bundle/BlogBundle).\n The namespace should begin with a vendor name like your company name, your\nproject name, or your client name, followed by one or more optional category\n sub-namespaces, and it should end with the bundle name itself\n(which must have Bundle as a suffix).\n\nUse / instead of \ for the namespace delimiter to avoid any problem.";