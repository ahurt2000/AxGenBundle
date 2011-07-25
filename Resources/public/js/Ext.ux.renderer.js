/*
 * G.P. Renderer for ComboBox in Grids  Ext JS Library 2.2
 * 
 * Alejandro Hurtado <ahurt2000@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * 
 */
Ext.ns("Ext.ux.renderer");
Ext.ux.renderer.ComboRenderer = function(options) {
    var value = options.value;
    var combo = options.combo;
	var grid = options.theGrid;
        /* If we are trying to load the displayField from a store that is not loaded, 
	   add a single listener to the combo store's load event to refresh the grid view */   
	if (combo.store.getCount() == 0 && grid) {
		combo.store.on('load', function(){
                    if (grid) {
                        grid.getView().refresh();
                    }
		}, {
                    single: true
		});
		return value;
	}
	/* Get the displayfield from the store or return the value itself if the record cannot be found */
	var valueField = combo.valueField;  
	var returnValue = value; 
	var idx = combo.store.findBy(function(record){
                if (record.get(valueField) == value) {
                        returnValue = record.get(combo.displayField);
                        return true;
                }
	});
	if (idx == -1) { // previously saved missing values
		return '';
	}
	return returnValue;
    
};

Ext.ux.renderer.Combo = function(combo,gridId){
	return function(value, meta, record){
		return Ext.ux.renderer.ComboRenderer({
			value: value,
			meta: meta,
			record: record,
			combo: combo
			,theGrid: Ext.getCmp(gridId)
		});
	}	
}



