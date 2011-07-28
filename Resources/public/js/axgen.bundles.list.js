/*
 * bundles list.   - Ext JS Library 2.2
 * bundle: AxgenBundle 
 * Alejandro Hurtado <ahurt2000@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * 
 */
Ext.ns('AxGen.Bundles.List');
AxGen.Bundles.List = function(config){
    Ext.apply(this, config);
    AxGen.Bundles.List.superclass.constructor.call(this);
    this.init();
}

Ext.extend(AxGen.Bundles.List, Ext.grid.GridPanel,{
    stripeRows: true,
    height: 278,
    columns: [{
            header: 'Registered bundles',
            width: 150,
            dataIndex: 'name'
    }],
    init: function(){ 
        var bundle_rec = Ext.data.Record.create([
            { name: 'name'} 
        ]);
        
        var bundleReader = new Ext.data.JsonReader({
            root: "data",
            totalProperty: "total"
        }, bundle_rec);      
        
        var store_bundles_list = new Ext.data.Store({
            url: list_url,
            autoLoad: true,
            reader: bundleReader
        });        
        store_bundles_list.load();
        store_bundles_list.sort('name','ASC');
        
        this.store = store_bundles_list;
    }
});

Ext.reg('axgenbundleslist',AxGen.Bundles.List);