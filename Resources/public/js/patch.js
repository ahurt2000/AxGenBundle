/* Patch for Extjs v2. defined in (http://www.sencha.com/learn/Ext_FAQ_ComboBox#linked_comboBoxes) */
/* reload combobox after a setValue */
Ext.override(Ext.form.ComboBox, {
    setValue : function(v){
        //begin patch
        // Store not loaded yet? Set value when it *is* loaded.
        // Defer the setValue call until after the next load.
        if (this.store.getCount() == 0) {
            this.store.on('load',
                this.setValue.createDelegate(this, [v]), null, {
                    single: true
                });
            return;
        }
        //end patch
        var text = v;
        if(this.valueField){
            var r = this.findRecord(this.valueField, v);
            if(r){
                text = r.data[this.displayField];
            }else if(this.valueNotFoundText !== undefined){
                text = this.valueNotFoundText;
            }
        }
        this.lastSelectionText = text;
        if(this.hiddenField){
            this.hiddenField.value = v;
        }
        Ext.form.ComboBox.superclass.setValue.call(this, text);
        this.value = v;
    }
});

/*
 * Patch for Extjs v2
 * Hide/show Labels for TexField hide/show
 */
Ext.override(Ext.layout.FormLayout, {
    renderItem : function(c, position, target){
        if(c && !c.rendered && c.isFormField && c.inputType != 'hidden'){
            var args = [
            c.id, c.fieldLabel,
            c.labelStyle||this.labelStyle||'',
            this.elementStyle||'',
            typeof c.labelSeparator == 'undefined' ? this.labelSeparator : c.labelSeparator,
            (c.itemCls||this.container.itemCls||'') + (c.hideLabel ? ' x-hide-label' : ''),
            c.clearCls || 'x-form-clear-left' 
            ];
            if(typeof position == 'number'){
                position = target.dom.childNodes[position] || null;
            }
            if(position){
                c.itemCt = this.fieldTpl.insertBefore(position, args, true);
            }else{
                c.itemCt = this.fieldTpl.append(target, args, true);
            }
            c.actionMode = 'itemCt';
            c.render('x-form-el-'+c.id);
            c.container = c.itemCt;
            c.actionMode = 'container';
        }else {
            Ext.layout.FormLayout.superclass.renderItem.apply(this, arguments);
        }
    }
});
Ext.override(Ext.form.TriggerField, {
    actionMode: 'wrap',
    onShow: Ext.form.TriggerField.superclass.onShow,
    onHide: Ext.form.TriggerField.superclass.onHide
});
Ext.override(Ext.form.Checkbox, {
    actionMode: 'wrap',
    getActionEl: Ext.form.Checkbox.superclass.getActionEl
});
Ext.override(Ext.form.HtmlEditor, {
    actionMode: 'wrap'
});