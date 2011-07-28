/*
 * Main Menu.   - Ext JS Library 2.2
 * bundle: AxgenBundle 
 * Alejandro Hurtado <ahurt2000@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * 
 */
Ext.ns('AxGen.BundleMenu');
AxGen.BundleMenu = function(config){
    
    Ext.apply(this, config);
    AxGen.BundleMenu.superclass.constructor.call(this);
}
Ext.extend(AxGen.BundleMenu, Ext.Toolbar, {
    id: 'axgen_menu',
    renderTo: 'menu',
    items:[{
        xtype: 'tbbutton',
        text: 'Bundles',
        menu:[{
            xtype: 'tbbutton',  
            text: 'New Bundle',
            handler: function(){
                bundlewin = new AxGen.BundleWin();
                bundlewin.show();
            },
            scope:this   
        },{
            text: 'Registered Bundles',
            handler: function(){
                bundlelistwin = new AxGen.BundleListWin();
                bundlelistwin.show();
            }
           
        }]
    },{ 
        xtype: 'tbbutton',
        text: 'Doctrine',
        menu: [{
            text: 'Database create',
            handler: function(){
                Ext.MessageBox.alert("Sorry"," :( This is not developed yet");
            }              
        },{
            text: 'New Entity',
            handler: function(){
                entitywin = new AxGen.EntityWin();
                entitywin.show();
            }
        },{
            text: 'Entities',
            handler: function(){
                entitieswin = new AxGen.EntitiesWin();
                entitieswin.show();
            }  
        },{
            text: 'Schema update',
            handler: function(){
                Ext.MessageBox.alert("Sorry"," :( This is not developed yet");
            }            
        },{            
            text: 'CRUD',
            handler: function(){
                crudwin = new AxGen.CrudWin();
                crudwin.show();
            } 
        }]
    }]

});


Ext.reg('axgenmenu', AxGen.BundleMenu );

