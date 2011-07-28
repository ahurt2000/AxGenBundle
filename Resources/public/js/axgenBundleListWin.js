/*
 * Bundle list windows.   - Ext JS Library 2.2
 * bundle: AxgenBundle 
 * Alejandro Hurtado <ahurt2000@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * 
 */
Ext.ns('AxGen.BundleListWin');
AxGen.BundleListWin = function(config){
    Ext.apply(this, config);

    this.cancel_edit = new Ext.Button({
        text:'Close',
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
        this.cancel_edit
        ]
    });    
    
    AxGen.BundleListWin.superclass.constructor.call(this);
    this.init();
}
Ext.extend(AxGen.BundleListWin, Ext.Window, {
    id:'win-entity-gen',
    layout:'form',
    title:'Registered bundles list',
    autoScroll:true,
    modal: true,
    closeAction:'close',
    closable: true,
    bodyStyle:'padding:5px 5px 0',
    width: 200,
    init: function(){
        this.bundle_list = new AxGen.Bundles.List();
        this.add(this.bundle_list);
    }
});

Ext.reg('axbundlelistwin',AxGen.BundleListWin );