
define([
    // "dojo/NodeList-traverse",
    "dijit/form/Form",
    "dijit/form/RadioButton",
    "app/tabManager",
    "dijit/form/Select",
    "dojo/data/ObjectStore",
    "dojo/store/Memory",
    "dijit/form/CheckBox",
    "dijit/focus",
    "dojo/keys",
    "dojo/dom",
    "dojo/query",
    "dojo/on",
    "dijit/form/TextBox",
    "app/Grids/gridLoadUpdate",
    "app/searchLoads",
    "dijit/form/Button",
    "dijit/form/DateTextBox",
    "dijit/registry",
    "dojo",
    "dojox/charting/Chart2D",
    "dojox/grid/EnhancedGrid",
    "dojo/data/ItemFileWriteStore",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane",
    "dijit/Dialog",
    "dojo/_base/declare",
    "dojo/domReady!",

], function(

    Form,
    RadioButton,
    tabManager,
    Select, ObjectStore, Memory,
    CheckBox,
    focusUtil,
    keys,
    dom,
    query,
    on,
    TextBox,
    gridLoadUpdate,
    searchLoads,
    Button,
    DateTextBox,
    registry,
    dojo,
    Chart2D,
    EnhancedGrid,
    ItemFileWriteStore,
    TabContainer,
    ContentPane,
    Dialog ,
    declare){ 

    return declare(null, {


        load:  function(){

            var textLimit = new ContentPane({
                content: "<span id='limitText'>LIMIT: 50 LOADS</span>",
                style: "padding:0px"
            });


            var beginLoads = new DateTextBox({
                constraints: { datePattern : 'yyyy-MM-dd' },
                placeHolder: "START DATE",
                style: "width: 150px; margin: 10px",
                id: 'beginLoads'
            });

            var endLoads = new DateTextBox({
                constraints: { datePattern : 'yyyy-MM-dd' },
                placeHolder: "END DATE",
                id: 'endLoads',
                style: "width: 150px; margin: 10px",
            });

            var newStoreCompany = new ItemFileWriteStore({

                url: "/backend/web/user/get-admin-short"
                // url: "URL"
            });

            var Company = new Select({
                name: "company",
              //  value: item.company_id,
                store: newStoreCompany,
                style: "width: 150px; margin: 10px",
                placeHolder: "SELECT COMPANY"

            });

            var checkSearchLoads = new CheckBox({  //'enject','canceled','completed','dispatched','scheduled'
                value: 1,                
                style: "float:left",
                checked: true,                
            });
			
            var checkSearchInvoice = new CheckBox({  //'enject','canceled','completed','dispatched','scheduled'
                value: 1,
                style: "float:left",
                checked: true,

            });

            var checkSearchTruck = new CheckBox({  //'enject','canceled','completed','dispatched','scheduled'
                value: 1,
                style: "float:left",
                checked: true,

            });
			
            var checkSearchOrigin = new CheckBox({  //'enject','canceled','completed','dispatched','scheduled'
                value: 1,
                style: "float:left",
                checked: true,

            });
			
            var checkSearchOriginLabel = new ContentPane({
                style: "float: left; margin-right: 17px;",
                content: "FROM",
                baseClass: 'checkSearchLoadsLabel',
            });

            var checkSearchDestination = new CheckBox({  //'enject','canceled','completed','dispatched','scheduled'
                value: 1,
                style: "float:left",
                checked: true,

            });
			
            var checkSearchDestinationLabel = new ContentPane({
                content: "TO",
                baseClass: 'checkSearchLoadsLabel',
            });

            var checkSearchDriver = new CheckBox({  //'enject','canceled','completed','dispatched','scheduled'
                value: 1,
                style: "float:left",
                checked: true,

            });
            var checkSearchDriverLabel = new ContentPane({
                content: "DRIVERS",
                baseClass: 'checkSearchLoadsLabel',
            });

            var checkSearchLoadsLabel = new ContentPane({
                style: "float: left; margin-right: 11px;",
                content: "LOADS",
                baseClass: 'checkSearchLoadsLabel',
            });

            var checkSearchInvoiceLabel = new ContentPane({

                content: "INVOICES",
                baseClass: 'checkSearchLoadsLabel',
            });

            var checkSearchTruckLabel = new ContentPane({
                style: "float: left; margin-right: 4px;",
                content: "TRUCKS",
                baseClass: 'checkSearchLoadsLabel',
            });

            var checksContainer = new ContentPane({
                baseClass: "checksContainer"
            });

            checksContainer.addChild(checkSearchLoads);
            checksContainer.addChild(checkSearchLoadsLabel);
            checksContainer.addChild(checkSearchInvoice);
            checksContainer.addChild(checkSearchInvoiceLabel);

            checksContainer.addChild(checkSearchTruck);
            checksContainer.addChild(checkSearchTruckLabel);

            checksContainer.addChild(checkSearchDriver);
            checksContainer.addChild(checkSearchDriverLabel);

            var radioContainer = new ContentPane({
                style: "font-size: 13px;",
                id: "radioContainer",
                baseClass: "checksContainer"
            });

            var radioPaid = new RadioButton({
                checked: false,
                style: "float: left; margin-top: 3px;",
                value: "2",
                name: "paid",
            });
            var radioPaidLabel = new ContentPane({
                style: "float: left;",
                content: "PAID",
                baseClass: 'checkSearchLoadsLabel' 
            });

            var radioHold = new RadioButton({
                checked: false,
                style: "float: left; margin-top: 3px;",
                value: "5",
                name: "paid",
            });

            var radioHoldLabel = new ContentPane({
                style: "padding: 0px;width: 0px;margin: 0px;",
                content: "HOLD",
                baseClass: 'checkSearchLoadsLabel'
            });

            var radioNotPaid = new RadioButton({
                style: "float: left; margin-top: 3px;",
                checked: false,
                value: "3",
                name: "paid",
            });

            var radioradioNotPaid = new ContentPane({
                style: "float: left;",
                content: "NOTPAID",
                baseClass: 'checkSearchLoadsLabel'
            });

            var radioPendingPaid = new RadioButton({
                style: "float: left; margin-top: 3px;",
                checked: false,
                value: "4",
                name: "paid",
            });

            var radioLabelPendingPaid = new ContentPane({
                style: "float: left;",
                content: "PENDING",
                baseClass: 'checkSearchLoadsLabel'
            });
			
            var radioAllPaid = new RadioButton({
                style: "float: left;margin-top: 3px;",
                checked: true,
                value: "1",
                name: "paid",
            });

            var radioPaidAllLabel = new ContentPane({
                style: "float: left;",
                content: "ALL",
                baseClass: 'checkSearchLoadsLabel'
            });

            radioContainer.addChild(radioAllPaid);
            radioContainer.addChild(radioPaidAllLabel);

            radioContainer.addChild(radioPaid);
            radioContainer.addChild(radioPaidLabel);

            radioContainer.addChild(radioHold);
            radioContainer.addChild(radioHoldLabel);

            radioContainer.addChild(radioNotPaid);
            radioContainer.addChild(radioradioNotPaid);



            radioContainer.addChild(radioPendingPaid);
            radioContainer.addChild(radioLabelPendingPaid);

            var searhTextBox = new TextBox({
                name: "searhTextBox",
                id: "searhTextBox",
                value: "" /* no or empty value! */,
                placeHolder: "load search",
                style: "width: 150px; margin: 10px"
            });

            var myButtonSearch = new Button({
                id: 'myButtonSearch',
                label: "Search Loads",
                style: "margin-left:10px",
                onClick: function(){
                    Search();
                }
            });

            on(document, "keydown", function(event) {
                if(event.keyCode == '13')
                {
                    // Search();
                }
            });

            var cbCanceled = new CheckBox({  //'enject','canceled','completed','dispatched','scheduled'
                name: "canceled",
                id : "canceled",
                value: "canceled",           
                style: "float:left",
                checked: false,
                onChange: function(b){                 

                }
            });

            var Checks = new ContentPane({
                baseClass: 'Checks',
            });      

            var cbCanceledLabel = new ContentPane({
                baseClass: 'cbCanceledLabel',
                content: "Paid"
            });
            Checks.addChild(cbCanceled);
            Checks.addChild(cbCanceledLabel);

            var store = new Memory({
                data: [
                    { id: "all", label: "All" },
                    { id: "dispatched", label: "Dispatched" },
                    { id: "completed", label: "Completed" },
                    { id: "canceled", label: "Canceled" },
                    { id: "scheduled", label: "Scheduled" },
                    { id: "enject", label: "Enject" },
                ]
            });
            var os = new ObjectStore({ objectStore: store });
            var s = new Select({
                store: os,
                style: "display: table;\n" +
                "    margin-left: 10px;\n" +
                "    margin-top: 5px;"
            });

            s.on("change", function(){
                var newStore = new ItemFileWriteStore({
                    url: "URL="+this.get("value")
                });
                if(this.get("value") == "all")
                {
                    var newStore = new ItemFileWriteStore({
                        url: "URL"
                    });
                }
                var gridDoc = dijit.byId("gridDoc");
                gridDoc.setStore(newStore);
                var tab1 =  dijit.byId("tab1");
                var tc = dijit.byId("dijit_layout_TabContainer_0");
                tc.selectChild(tab1);

            });


            function Search() {
                var limit1 = query("input[name=paid]")[0];
                var limit = query("input[name=paid]");

                var res = 1;
                limit.forEach(function (radio) {
                    if(radio.checked) {res = radio.value;}
                });       

                var startDate = dojo.byId('beginLoads').value;
                var endDate = dojo.byId('endLoads').value;
                var searhTextBox = dojo.byId("searhTextBox").value;
                console.log("TEXT:" + searhTextBox);                

                var newStore = new ItemFileWriteStore({

                    url: "URL="+startDate+"&end="+endDate+
                        "&text="+encodeURIComponent(searhTextBox)+
                        "&company="+encodeURIComponent(Company.value)+
                        "&loads="+checkSearchLoads.get('value')+
                        "&trucks="+checkSearchTruck.get('value')+
                        "&drivers="+checkSearchDriver.get('value')+
                        "&origin="+checkSearchOrigin.get('value')+
                        "&destination="+checkSearchDestination.get('value')+
                        "&paid="+res+
                        "&invoices="+checkSearchInvoice.get('value')
                });

                var gridDoc = dijit.byId("gridDoc");
                var gridStructure = new gridLoadUpdate();

                gridDoc.set('structure',gridStructure.layout());
                gridDoc.setStore(newStore);
                dojo.connect( gridDoc, "onStyleRow", gridDoc, function( row ) {
                    var item = this.getItem( row.index );
                    var nd = dojo.query('td[idx="10"]'  /* <= put column index here */, row.node)[0];
                    if(nd){
                        if(nd.innerHTML == 'paid' /* <= put cell content here */){
                            nd.style.backgroundColor = "LightGreen";
                        }else if(nd.innerHTML == "not paid"){
                            nd.style.backgroundColor = "LightCoral ";
                        }                    }
                });

                var tab1 =  dijit.byId("tab1");
                var tc = dijit.byId("dijit_layout_TabContainer_0");

                tc.selectChild(tab1);
            }
            var aC3 =  dijit.byId('aC3');
            var LoadsSearch = new ContentPane({
                id: "LoadsSearch",
            });
            var TruckSearch = new ContentPane({
                id: "TruckSearch"
            });
            LoadsSearch.addChild(textLimit);
            LoadsSearch.addChild(beginLoads);
            LoadsSearch.addChild(endLoads);
            LoadsSearch.addChild(Company);
            LoadsSearch.addChild(checksContainer);

            LoadsSearch.addChild(radioContainer);

            LoadsSearch.addChild(searhTextBox);
            LoadsSearch.addChild(myButtonSearch);
            LoadsSearch.addChild(s);
			
            var searhDriverTextBox = new TextBox({
                name: "searhDriverTextBox",
                id: "searhDriverTextBox",
                value: "" /* no or empty value! */,
                placeHolder: "Driver",
                style: "width: 150px; margin: 10px"
            });

            TruckSearch.addChild(searhDriverTextBox);


            ///////////////////////broker search///////////////////////////////////////////////////////////////////
            var p_r = new ContentPane({
                content: "----Broker Search------"
            });
            var brokerSearchText = new TextBox({
                name: "brokerSearchText",
                id: "brokerSearchText",
                value: "" /* no or empty value! */,
                placeHolder: "Broker",
                style: "width: 150px; margin: 10px"
            });

            LoadsSearch.addChild(brokerSearchText);

            var myButtonSearchBroker = new Button({
                id: 'myButtonSearchBroker',
                label: "Search Broker TB",
                style: "margin-left:10px",
                onClick: function(){
                    SearchBroker();
                }
            });

            function SearchBroker() {
                var brokerSearchText = dojo.byId("brokerSearchText").value;
                var newStore = new ItemFileWriteStore({
                    url: "/backend/web/broker/getbrokersbydate?text="+brokerSearchText
                });
                var gridDoc = dijit.byId("gridBroker");
                gridDoc.setStore(newStore);
                var tab1 =  dijit.byId("tabBroker");
                var tc = dijit.byId("dijit_layout_TabContainer_0");
                tc.selectChild(tab1);
            }

            var brokerPartnersSearchText = new TextBox({
                name: "brokerPartnersSearchText",
                id: "brokerPartnersSearchText",
                value: "" /* no or empty value! */,
                placeHolder: "Broker Partner",
                style: "width: 150px; margin: 10px"
            });

            var myButtonPartnersBroker = new Button({
                id: 'myButtonPartnersBroker',
                label: "Search Customers",
                style: "margin-left:10px",
                onClick: function(){
                    SearchBrokerPartner();
                }
            });

            function SearchBrokerPartner(){
                var brokerPartnersSearchText = dojo.byId("brokerPartnersSearchText").value;
                var tc = dijit.byId("dijit_layout_TabContainer_0");
                $TablePartner = new ContentPane({
                    title: "PARTNERS",
                    closable: true,
                    onClose: function(){

                        tc.removeChild($TableTruck);
                        $TablePartner.destroyRecursive();
                    }
                });
                $TablePartner.set('href', 'URL='+encodeURIComponent(brokerPartnersSearchText));
                var tabControl = new tabManager();
                tabControl.control();
                tc.addChild($TablePartner);
                tc.selectChild($TablePartner);
            }

            LoadsSearch.addChild(myButtonSearchBroker);
            LoadsSearch.addChild(brokerPartnersSearchText);
            LoadsSearch.addChild(myButtonPartnersBroker);

            var xhrArgs = {
                url: "URL",
                handleAs: "text",
                load: function(data){

                    if(data == "admin" || data == "accountant")
                    {
                        var PayPartnersSearchText = new TextBox({
                            name: "PayPartnersSearchText",
                            id: "PayPartnersSearchText",
                            value: "" /* no or empty value! */,
                            placeHolder: "Partner Invoice Paid",
                            style: "width: 150px; margin: 10px"
                        });

                        var myButtonPartnersPay = new Button({
                            id: 'myButtonPartnersPay',
                            label: "Search Invoices",
                            style: "margin-left:10px",
                            onClick: function(){
                                SearchPayPartner();
                            }
                        });
                        LoadsSearch.addChild(PayPartnersSearchText);
                        LoadsSearch.addChild(myButtonPartnersPay);
                        function SearchPayPartner(){
                            var brokerPartnersSearchText = dojo.byId("PayPartnersSearchText").value;
                            var tc = dijit.byId("dijit_layout_TabContainer_0");
                            $TablePartner = new ContentPane({
                                title: "PARTNERS",
                                closable: true,
                                onClose: function(){

                                    tc.removeChild($TableTruck);
                                    $TablePartner.destroyRecursive();
                                }
                            });
                            $TablePartner.set('href', 'URL='+encodeURIComponent(brokerPartnersSearchText));
                            var tabControl = new tabManager();
                            tabControl.control();
                            tc.addChild($TablePartner);
                            tc.selectChild($TablePartner);
                        }
                    }
                },
                error: function(error){
                    console.log("An unexpected error occurred: " + error);
                }
            };           
            dojo.xhrGet(xhrArgs);       

            aC3.addChild(LoadsSearch);           
        },

        search: function (startDate,endDate) {         

            var newStore = new ItemFileWriteStore({

                url: "URL="+startDate+"&end="+endDate
            });
            var gridDoc = dijit.byId("gridDoc");

            gridDoc.setStore(newStore);
        }



    });



});