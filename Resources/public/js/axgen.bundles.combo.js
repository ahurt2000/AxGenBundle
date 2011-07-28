/*
 * formats combo.   - Ext JS Library 2.2
 * bundle: AxgenBundle 
 * Alejandro Hurtado <ahurt2000@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * 
 */

Ext.ns('AxGen.Bundles.Combo');
AxGen.Bundles.Combo = function(config){
    Ext.apply(this, config);
    AxGen.Bundles.Combo.superclass.constructor.call(this);
    this.init();
}

Ext.extend(AxGen.Bundles.Combo,Ext.form.ComboBox,{
    fieldLabel: 'Bundle',
    forceSelection:true,
    valueField: 'name',
    displayField: 'name',
    triggerAction: 'all',
    mode:'remote',
    init: function(){ 
        /* registered bundle list combo */            
        var bundle_rec = Ext.data.Record.create([
            { name: 'short'} ,
            { name: 'name'} 
        ]);
        
        var bundleReader = new Ext.data.JsonReader({
            root: "data",
            totalProperty: "total"
        }, bundle_rec);
        
        
        var dsbundles = new Ext.data.Store({
            url: list_url,
            reader: bundleReader
        });
        dsbundles.sort("name","ASC");   
        
        this.store = dsbundles;
    }       
});

Ext.reg('axgenbundlescombo',AxGen.Bundles.Combo );