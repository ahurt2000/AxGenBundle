/*
 * App.   - Ext JS Library 2.2
 * bundle: AxgenBundle 
 * Alejandro Hurtado <ahurt2000@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * 
 */
Ext.onReady(function() {
    Ext.QuickTips.init();
    
    //a message wait for ajax calls
    var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});
    Ext.Ajax.on('beforerequest', myMask.show, myMask);
    Ext.Ajax.on('requestcomplete', myMask.hide, myMask);
    Ext.Ajax.on('requestexception', myMask.hide, myMask);

    //the menu
    main_menu = new AxGen.BundleMenu();



});

