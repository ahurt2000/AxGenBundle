/*
 * formats combo.   - Ext JS Library 2.2
 * bundle: AxgenBundle 
 * Alejandro Hurtado <ahurt2000@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * 
 */

Ext.ns('AxGen.Formats.Combo');
AxGen.Formats.Combo = function(config){
    Ext.apply(this, config);
    AxGen.Formats.Combo.superclass.constructor.call(this);
}

Ext.extend(AxGen.Formats.Combo,Ext.form.ComboBox,{
    store: new Ext.data.SimpleStore({
        fields: ['format','name'],
        data: [
        ["annotation","Annotation"],["yml","YML"],["xml","XML"],["php","PHP"]
        ]
    }),
    mode:'local',
    value: 'annotation',
    triggerAction: 'all',
    displayField: 'name',
    valueField: 'format',
    typeAhead: true,
    editable: false,
    selectOnFocus: true,
    forceSelection: true
});

Ext.reg('axgenformatscombo',AxGen.Formats.Combo );