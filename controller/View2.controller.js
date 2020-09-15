var namespace = "";
var file_name = "TCDD_v3";
var prefix = file_name;
var view_path = prefix + ".controller.Tmp_view";
var item_selection_dialog_id = "item_selection_dialog_id";
var item_selection_dialog_name = prefix + ".view.Item_selection_dialog";
var item_selection_sub_header_text_id = "item_selection_sub_header_text_id";
var item_quantity_input_id = "item_quantity_input_id";
var item_list_id = "item_list_id";
var genel_veri_url = "https://sap-project-backend.herokuapp.com/genelVeri";
var items_text = "eşyalar";
var unit = "Birim";
var item_selection_ok_button_id = "item_selection_ok_button_id";
var item_selection_text = "Eşya Seçiniz";
var item_quantity_selection_text = "Miktar Giriniz";
var type = "Tip";
var max_item_quantity = "MaksimumYük";
var item_quantity_unit = "YükBirimi";
var station_type_id = "station_type_id";
var departure_station_select_id = "departure_station_select_id";
var arrival_station_select_id = "arrival_station_select_id";
var stations_text = "istasyonlar";
var home_text = "yurtiçi";
var abroad_text = "yurtdışı";
var clients_text = "müşteriler";
var name_text = "İsim";
var vagons_text = "vagonlar";
var item_unit_selection_id = "item_unit_selection_id";
var quantity_error_text = "Vagon Yük Miktarı Aşıldı.";
var station_selection_dialog_id = "station_selection_dialog_id";
var departure_selection_dialog_id = "departure_selection_dialog_id";
var departure_selection_dialog_name =
    prefix + ".view.Departure_selection_dialog";
var departure_selection_radio_button_group_id =
    "departure_selection_radio_button_group_id";
var departure_selection_ok_button_id = "departure_selection_ok_button_id";
var arrival_selection_dialog_id = "arrival_selection_dialog_id";
var arrival_selection_radio_button_group_id =
    "arrival_selection_radio_button_group_id";
var arrival_selection_dialog_name = prefix + ".view.Arrival_selection_dialog";
var arrival_selection_ok_button_id = "arrival_selection_ok_button_id";
var client_selection_dialog_id = "client_selection_dialog_id";
var client_selection_dialog_name = prefix + ".view.Client_selection_dialog";
var client_selection_radio_button_group_id =
    "client_selection_radio_button_group_id";
var client_selection_ok_button_id = "client_selection_ok_button_id";

sap.ui.define(
    [
        "sap/m/MessageToast",
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/base/Log",
        "../model/formatter",
        "sap/ui/core/Fragment",
        "sap/ui/core/Item",
        "sap/m/Dialog",
        "sap/m/DialogType",
        "sap/m/Button",
        "sap/m/ButtonType",
        "sap/ui/core/Core",
        "sap/m/Text",
    ],
    function (
        MessageToast,
        Controller,
        JSONModel,
        Log,
        formatter,
        Fragment,
        Item,
        Dialog,
        DialogType,
        Button,
        ButtonType,
        Core,
        Text,
        newData,
        esyalar,
        kalemNo,
        selectedTalep
    ) {
        "use strict";

        var data, items, vagons, home_stations, abroad_stations, clients;

        return Controller.extend("sap.m.sample.SplitApp.C", {
            formatter: formatter,
            onInit: function () {
                this.getSplitAppObj().setHomeIcon({
                    phone: "phone-icon.png",
                    tablet: "tablet-icon.png",
                    icon: "desktop.ico",
                });
                var oModel = new sap.ui.model.json.JSONModel();
                var oResourceBundle = this.getOwnerComponent()
                    .getModel("i18n")
                    .getResourceBundle();
                var url = oResourceBundle.getText("dataUrl1");
                var url2 = oResourceBundle.getText("dataUrl2");

                oModel.loadData(url); //Genelveri json yuklemesi
                this.getView().setModel(oModel, "dataModel2");

                var oModel2 = new sap.ui.model.json.JSONModel();
                oModel2.loadData(url2); //Talepler json yuklemesi
                this.getView().setModel(oModel2, "dataModel");
                kalemNo = 1; //Kalem no initial deger onInit'te 1 olarak atanır. Daha sonra gerekirse artar.
                newData = [];
                esyalar = [];

                this.getView().byId("b2").setEnabled(false);
                this.getView().byId("b3").setEnabled(false);

                var oVieww = this.getView();
                var oModell = new sap.ui.model.json.JSONModel(genel_veri_url);
                oModel.attachRequestCompleted(function () {
                    data = JSON.parse(oModel.getJSON());
                    items = data[items_text];
                    vagons = data[vagons_text];
                    home_stations = data[stations_text][home_text];
                    abroad_stations = data[stations_text][abroad_text];
                    clients = data[clients_text];
                    oVieww.setModel(oModell, "fragmentModel");
                });
                this.setDatePicker(1, 1200);

                var date_picker = this.byId("el5");
                date_picker.addDelegate(
                    {
                        onAfterRendering: function () {
                            date_picker
                                .$()
                                .find("INPUT")
                                .attr("disabled", true);
                        },
                    },
                    date_picker
                );
            },
            onSelectionChange: function (oEvent) {
                // seçilmiş yeni kalem no'yu al
                const selectedValue = oEvent
                    .getParameter("selectedItem")
                    .getKey();

                // yeni kalem no'nun verisini al
                const yeniKalem = this.getView()
                    .getModel("talep")
                    .getProperty("/VagonBilgi")[selectedValue - 1];

                // yeni veriyi "seçiliKalem" modeline ata
                this.getView()
                    .getModel("seçiliKalem")
                    .setProperty("/", yeniKalem);
            },

            onOrientationChange: function (oEvent) {
                var bLandscapeOrientation = oEvent.getParameter("landscape"),
                    sMsg =
                        "Orientation now is: " +
                        (bLandscapeOrientation ? "Landscape" : "Portrait");
                MessageToast.show(sMsg, {
                    duration: 5000,
                });
            },

            onPressNavToDetail: function () {
                this.getSplitAppObj().to(this.createId("detailDetail"));
            },

            getTableData: function () {
                var sum = 0;
                var model = this.getView().getModel("dataModel3");

                for (var i = 0; i < model.getProperty("/").length; i++) {
                    if (model.getProperty("/")[0].EşyaBirimi == "kilo") {
                        sum += parseInt(model.getProperty("/")[i].EşyaMiktarı);
                    } else {
                        sum +=
                            1000 *
                            parseInt(model.getProperty("/")[i].EşyaMiktarı);
                    }
                }
            },
            curr_capacity: null,

            type: "X", //abroad_text, // yurtiçi - yurtdışı
            vagon_type: "A", // vagon tipi
            vagon_quantity: 2, // vagon adedi
            total_item_quantity: 10, // şu ana kadarki eşyaların miktarı toplamı

            item_selection_returns: null, // key, miktar, birim
            departure_selection_returns: null, // istasyon adı
            arrival_selection_returns: null, // istasyon adı
            client_selection_returns: null, // müşteri

            onAddCartPress: function () {
                var tarih = this.getView().byId("el5").getDateValue();
                var vagonTipi = this.getView()
                    .byId("el4")
                    .getSelectedItem()
                    .getText();
                var vagonAdedi = this.getView().byId("el6").getValue();
                var kalkisIstasyonu = this.departure_selection_returns;
                var varisIstasyonu = this.arrival_selection_returns;
                var toplamYuk = 5;
                var yukBirimi = "ton";
                var teslimAlan = this.client_selection_returns;
                var teslimatTipi = this.getView()
                    .byId("el9")
                    .getSelectedItem()
                    .getText();
                var paraBirimi = this.getView()
                    .byId("el12")
                    .getSelectedItem()
                    .getText();
                var odemeTuru = this.getView()
                    .byId("el14")
                    .getSelectedItem()
                    .getText();
                var krediliTasima = this.getView().byId("el15").getSelected();
                var cariHesap = this.getView().byId("el13").getSelected();
                var kiymetAlma = this.getView().byId("el16").getSelected();

                if (kalemNo === 1) {
                    //ilk kalem eklenirken.
                    let tempEsya = JSON.parse(JSON.stringify(esyalar));
                    var tempData0 = {
                        //İlk Kalem eklenirken ilk bilgiler de jsona eklenir.
                        Şirketİsmi: teslimAlan,
                        TalepDurumu: "işleniyor",
                        TalepTürü: "Ticari Müşteri-1",
                        İstasyonlar: {
                            Çıkış: kalkisIstasyonu,
                            Varış: varisIstasyonu,
                        },
                        TeslimTarihi: tarih,
                        TaşımaTürü: teslimatTipi,
                        VagonBilgi: [
                            {
                                Eşyalar: tempEsya,
                                KalemNo: 1,
                                VagonTipi: vagonTipi,
                                VagonSayısı: vagonAdedi,
                                ToplamYük: toplamYuk,
                                YükBirimi: yukBirimi,
                                //	"ParaBirimi": paraBirimi,
                                //	"ÖdemeTürü": odemeTuru
                                KıymetAlma: krediliTasima,
                                KrediliTaşıma: kiymetAlma,
                                CariHesap: cariHesap,
                            },
                        ],
                    };
                    newData.push(tempData0); //ilk kalem modele eklenir.
                    kalemNo = kalemNo + 1; //Kalem no 1 arttırılır.
                    this.getView().byId("el2").setText(kalemNo);
                    this.getView().byId("el22").setTitle(kalemNo);
                    let oModel = new sap.ui.model.json.JSONModel(
                        newData[0].VagonBilgi[0]
                    ); //Eşyalar modelinin set edilmesi.
                    this.getView().setModel(oModel, "dataModel4");

                    let oModel2 = new sap.ui.model.json.JSONModel(newData[0]); //Upload edilecek modelin tümünün set edilmesi.
                    this.getView().setModel(oModel2, "sendData");
                } else {
                    //ilk kalem eklendiyse.
                    let tempEsya = JSON.parse(JSON.stringify(esyalar));
                    var tempData1 = {
                        Eşyalar: tempEsya,
                        KalemNo: kalemNo,
                        VagonTipi: vagonTipi,
                        VagonSayısı: vagonAdedi,
                        ToplamYük: toplamYuk,
                        YükBirimi: yukBirimi,
                        //"ParaBirimi": paraBirimi,
                        //"ÖdemeTürü": odemeTuru
                        KıymetAlma: krediliTasima,
                        KrediliTaşıma: kiymetAlma,
                        CariHesap: cariHesap,
                    };
                    newData[0].VagonBilgi.push(tempData1); //Kalem modele eklenir.
                    kalemNo = kalemNo + 1; //Kalem no 1 arttirilir.
                    let oModel = newData[0].VagonBilgi; //Upload edilecek modelin vagonbilgi kısmının güncellenmesi.
                    this.getView()
                        .getModel("sendData")
                        .setProperty("/VagonBilgi", oModel);
                }

                var kalemBox = this.getView().byId("kalemBox"); //Kalem sayisini gosteren combobox.

                var newItem = new sap.ui.core.Item({
                    //Combobox dinamik olarak guncelleniyor.
                    text: (kalemNo - 1).toString(),
                });
                kalemBox.addItem(newItem);

                this.getSplitAppObj().to(this.createId("yeniKalem")); //Sayfa degistirildi. Kalem ozetleri sayfasi acildi.
            },

            // talep yapılan gün ve geçmişi seçmeye izin vermez
            setDatePicker: function (start_date, total_days) {
                var date_input = this.byId("el5");
                var day_length = 24 * 60 * 60 * 1000; //as millisecond
                var start = start_date * day_length;
                var end = (start_date + total_days) * day_length;
                var today = new Date();
                date_input.setValue(
                    formatter.formatDate(new Date(today.getTime() + start))
                );
                date_input.setMinDate(new Date(today.getTime() + start));
                date_input.setMaxDate(new Date(today.getTime() + end));
            },

            onKalemBoxSelect: function (oEvent) {
                //Kalem comboboxunun bir elemani secildiginde tetiklenen fonksiyon.
                var selected = oEvent.getParameter("selectedItem").getText();
                var kalemBox = this.getView().byId("kalemBox"); //Kalem sayisini gosteren combobox.
                var index0 = parseInt(selected, 10) - 1;
                let oModel = newData[0].VagonBilgi[index0];
                this.getView().getModel("dataModel4").setProperty("/", oModel);
            },
            onTeslimatTipiSelect: function () {
                this.getView().byId("b2").setEnabled(true);
                this.getView().byId("b3").setEnabled(false);
                this.getView().byId("b2").setValue("");
                this.getView().byId("b3").setValue("");
            },

            onCikisSelect: function () {
                this.getView().byId("el8").setEnabled(true);
            },
            onSavePress: function () {
                console.log("JSSS:", newData[0]);
                jQuery.ajax({
                    type: "POST",
                    data: JSON.stringify(newData[0]),
                    contentType: "application/json",
                    url: "https://sap-project-backend.herokuapp.com/talep",
                    success: function () {
                        MessageToast.show("Talep Başarıyla Kaydedildi.", {
                            duration: 5000,
                        });

                        setTimeout(() => {
                            location.reload();
                        }, 1500);
                    },
                    error: function (error) {
                        console.log("HATA: ", error);
                        MessageToast.show("Talep Kaydedilemedi, Hata..", {
                            duration: 5000,
                        });
                        setTimeout(() => {
                            location.reload();
                        }, 1500);
                    },
                });
            },

            onDeleteButtonClick: function () {
                var table = this.getView().byId("productTable1");
                var arr1 = table.getSelectedItems();
                var arr2 = table.getItems();
                var model = this.getView().getModel("dataModel3");
                for (var i = 0; i < arr1.length; i++) {
                    let index = arr2.indexOf(arr1[i]);
                    esyalar.splice(index, 1);
                    arr2.splice(index, 1);
                }
                var oModel = new sap.ui.model.json.JSONModel(esyalar);
                this.getView().setModel(oModel, "dataModel3");
            },
            onAddButtonClick: function () {
                MessageToast.show("Basıldı", {
                    duration: 5000,
                });

                var temp = {
                    Eşyaİsmi: "küçükbaş canlı hayvan",
                    EşyaMiktarı: 300,
                    EşyaBirimi: "kilo",
                };
                esyalar.push(temp);
                var oModel = new sap.ui.model.json.JSONModel(esyalar);
                this.getView().setModel(oModel, "dataModel3");
            },

            onUpdateFinished: function (oEvent) {
                var firstItem = this.getView().byId("masterList").getItems()[0];
                this.getView()
                    .byId("masterList")
                    .setSelectedItem(firstItem, true);
                this.getView().byId("masterList").getItems()[0].firePress();
            },

            onNewCartPress: function () {
                newData = [];
                this.getSplitAppObj().to(this.createId("yeniVagon"));
            },
            onNewKalemPress: function () {
                this.getView().byId("el5").setEnabled(false);
                for (var i = esyalar.length; i > 0; i--) {
                    //Array Bosaltiliyor.
                    esyalar.pop();
                }
                this.getView().getModel("dataModel3").setData(null);
                this.getSplitAppObj().to(this.createId("yeniVagon"));
            },

            onPressDetailBack: function () {
                this.getSplitAppObj().backDetail();
            },

            onPressMasterBack: function () {
                this.getSplitAppObj().backMaster();
            },

            onPressGoToMaster: function () {
                this.getSplitAppObj().toMaster(this.createId("master2"));
            },

            onListItemPress: function (oEvent) {
                this.getView().byId("combo").setSelectedKey("1");
                var sToPageId = oEvent
                    .getParameter("listItem")
                    .getCustomData()[0]
                    .getValue();
                this.getSplitAppObj().toDetail(this.createId(sToPageId));

                selectedTalep = oEvent.getParameter("listItem").getNumber();

                const baseUrl = "https://sap-project-backend.herokuapp.com";
                const talepModel = new sap.ui.model.json.JSONModel();
                console.log("Selected: " + selectedTalep);
                talepModel
                    .loadData(baseUrl + "/talep/" + selectedTalep)
                    .then(() => {
                        //default "kalem"
                        this.getView().setModel(
                            new sap.ui.model.json.JSONModel(
                                talepModel.getProperty("/VagonBilgi")[0]
                            ),
                            "seçiliKalem"
                        );
                    });
                this.getView().setModel(talepModel, "talep");

                //placeholder yerine direkt "1" numarası çıkacaksa comment out
                this.getView().byId("combo").setSelectedKey("1");
            },

            onPressModeBtn: function (oEvent) {
                var sSplitAppMode = oEvent
                    .getSource()
                    .getSelectedButton()
                    .getCustomData()[0]
                    .getValue();

                this.getSplitAppObj().setMode(sSplitAppMode);
                MessageToast.show(
                    "Split Container mode is changed to: " + sSplitAppMode,
                    {
                        duration: 5000,
                    }
                );
            },

            onApproveDialogPress: function () {
                const oView = this.getView();

                // Form Validation
                let girilenVeriler = [];

                girilenVeriler.push(oView.byId("el6").getValue());
                girilenVeriler.push(oView.byId("el9").getSelectedItem());
                girilenVeriler.push(oView.byId("b2").getValue());
                girilenVeriler.push(oView.byId("b3").getValue());
                girilenVeriler.push(oView.byId("b1").getValue());

                if (girilenVeriler.some((item) => !item)) {
                    return MessageToast.show(
                        "Tüm gerekli veriler girilmiş olmalıdır."
                    );
                }
                if (!esyalar.length) {
                    return MessageToast.show(
                        "En az bir eşya girilmesi gereklidir."
                    );
                }

                if (!this.oApproveDialog) {
                    this.oApproveDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Onay",
                        content: new Text({
                            text:
                                "Bu kalemi onaylamak istediğinize emin misiniz?",
                        }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "Onayla",
                            press: function () {
                                this.onAddCartPress();
                                this.oApproveDialog.close();
                            }.bind(this),
                        }),
                        endButton: new Button({
                            text: "İptal",
                            press: function () {
                                this.oApproveDialog.close();
                            }.bind(this),
                        }),
                    });
                }

                this.oApproveDialog.open();
            },
            onApproveDialogPress2: function () {
                if (!this.oApproveDialog2) {
                    this.oApproveDialog2 = new Dialog({
                        type: DialogType.Message,
                        title: "İptal",
                        content: new Text({
                            text: "Bu kalemi iptal istediğinize emin misiniz?",
                        }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "İptal Et",
                            press: function () {
                                if (kalemNo == 1) {
                                    this.getSplitAppObj().to(
                                        this.createId("bosSayfa")
                                    );
                                } else {
                                    this.getSplitAppObj().to(
                                        this.createId("yeniKalem")
                                    );
                                }
                                this.getTableData();

                                this.oApproveDialog2.close();
                            }.bind(this),
                        }),
                        endButton: new Button({
                            text: "Vazgeç",
                            press: function () {
                                this.oApproveDialog2.close();
                            }.bind(this),
                        }),
                    });
                }

                this.oApproveDialog2.open();
            },
            onApproveDialogPress3: function () {
                if (!this.oApproveDialog3) {
                    this.oApproveDialog3 = new Dialog({
                        type: DialogType.Message,
                        title: "Onay",
                        content: new Text({
                            text:
                                "Bu talepi onaylamak istediğinize emin misiniz?",
                        }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "Onayla",
                            press: function () {
                                this.onSavePress();
                                this.getSplitAppObj().to(
                                    this.createId("bosSayfa")
                                );
                                this.oApproveDialog3.close();
                            }.bind(this),
                        }),
                        endButton: new Button({
                            text: "İptal",
                            press: function () {
                                this.oApproveDialog3.close();
                            }.bind(this),
                        }),
                    });
                }

                this.oApproveDialog3.open();
            },
            onApproveDialogPress4: function () {
                if (!this.oApproveDialog4) {
                    this.oApproveDialog4 = new Dialog({
                        type: DialogType.Message,
                        title: "Onay",
                        content: new Text({
                            text:
                                "Bu talepi iptal etmek istediğinize emin misiniz?",
                        }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "Onayla",
                            press: function () {
                                MessageToast.show(
                                    "Talep başarıyla iptal edildi.",
                                    {
                                        duration: 5000,
                                    }
                                );
                                setTimeout(() => {
                                    location.reload();
                                }, 1500);
                                this.oApproveDialog4.close();
                            }.bind(this),
                        }),
                        endButton: new Button({
                            text: "İptal",
                            press: function () {
                                setTimeout(() => {
                                    location.reload();
                                }, 1500);
                                this.oApproveDialog4.close();
                            }.bind(this),
                        }),
                    });
                }

                this.oApproveDialog4.open();
            },

            onApproveDialogPress5: function () {
                if (!this.oApproveDialog5) {
                    this.oApproveDialog5 = new Dialog({
                        type: DialogType.Message,
                        title: "Onay",
                        content: new Text({
                            text: "Yeni kalem açmak istediğinize emin misiniz?",
                        }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "Onayla",
                            press: function () {
                                this.onNewKalemPress();
                                this.oApproveDialog5.close();
                            }.bind(this),
                        }),
                        endButton: new Button({
                            text: "İptal",
                            press: function () {
                                this.oApproveDialog5.close();
                            }.bind(this),
                        }),
                    });
                }

                this.oApproveDialog5.open();
            },

            getSplitAppObj: function () {
                var result = this.byId("SplitAppDemo");
                if (!result) {
                    Log.info("SplitApp object can't be found");
                }
                return result;
            },

            bsearch: function (array, key, start, end, cmpfunction) {
                if (start > end) return -1;
                var mid = Math.floor((start + end) / 2);
                var tmp = cmpfunction(array[mid], key);
                if (tmp == 0) return mid;
                if (tmp > 0)
                    return this.bsearch(
                        array,
                        key,
                        start,
                        mid - 1,
                        cmpfunction
                    );
                return this.bsearch(array, key, mid + 1, end, cmpfunction);
            },

            setCurrCapacity: function () {
                this.vagon_type = this.getView()
                    .byId("el4")
                    .getSelectedItem()
                    .getText();
                this.vagon_quantity = this.getView().byId("el6").getValue();
                for (var i in vagons) {
                    var vagon = vagons[i];
                    if (vagon[type] == this.vagon_type) {
                        this.curr_capacity =
                            vagon[max_item_quantity] * this.vagon_quantity;
                        if (vagon[item_quantity_unit] == "ton")
                            this.curr_capacity *= 1000;
                    }
                }
            },

            setTotalItemQuantity: function () {
                this.total_item_quantity = 0;
                for (var x in esyalar)
                    this.total_item_quantity +=
                        esyalar[x].EşyaBirimi == "ton"
                            ? esyalar[x].EşyaMiktarı * 1000
                            : esyalar[x].EşyaMiktarı;
            },

            openItemSelectionDialog: function () // Eşya Seçimi
            {
                var oView = this.getView();

                // vagon adedi seçili olmalıdır
                let vagonAdedi = oView.byId("el6").getValue();
                if (!vagonAdedi) {
                    return sap.m.MessageToast.show(
                        "Vagon adedi girilmiş olmalıdır."
                    );
                }
                if (this.byId("vagonAdetHataMesaji").getText()) {
                    return sap.m.MessageToast.show(
                        "Vagon adedini kontrol ediniz."
                    );
                }

                if (!this.byId(item_selection_dialog_id)) {
                    Fragment.load({
                        id: oView.getId(),
                        name: item_selection_dialog_name,
                        controller: this,
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        oDialog.open();
                    });
                } else this.byId(item_selection_dialog_id).open();
                this.vagon_type = this.getView()
                    .byId("el4")
                    .getSelectedItem()
                    .getText();
                this.vagon_quantity = this.getView().byId("el6").getValue();
                for (var i in vagons) {
                    var vagon = vagons[i];
                    if (vagon[type] == this.vagon_type) {
                        this.curr_capacity =
                            vagon[max_item_quantity] * this.vagon_quantity;
                        if (vagon[item_quantity_unit] == "ton")
                            this.curr_capacity *= 1000;
                    }
                }
                this.setCurrCapacity();
            },
            closeItemSelectionDialogOk: function () {
                var quantity = parseInt(
                    this.byId(item_quantity_input_id).getValue()
                );
                if (
                    this.byId(item_unit_selection_id)
                        .getSelectedItem()
                        .getText() == "ton"
                )
                    quantity *= 1000;

                this.setTotalItemQuantity();
                console.log("Quantity: " + quantity);
                console.log("Capacity: " + this.curr_capacity);
                console.log("Total: " + this.total_item_quantity);
                if (this.total_item_quantity + quantity > this.curr_capacity) {
                    sap.m.MessageToast.show(quantity_error_text);
                    return;
                }
                var key = this.byId(item_list_id).getSelectedItem().getText();
                var unit = this.byId(item_unit_selection_id)
                    .getSelectedItem()
                    .getText();
                if (unit === "ton") {
                    quantity /= 1000;
                }
                var obj = {
                    Eşyaİsmi: key,
                    EşyaMiktarı: quantity,
                    EşyaBirimi: unit,
                };
                this.byId(item_selection_dialog_id).close();
                this.item_selection_returns = obj;

                esyalar.push(obj);
                var oModel = new sap.ui.model.json.JSONModel(esyalar);
                this.getView().setModel(oModel, "dataModel3");
                return obj;
            },
            closeItemSelectionDialogCancel: function () {
                this.resetItemSelectionDialog();
                (this.item_selection_returns = null),
                    this.byId(item_selection_dialog_id).close();
                return null;
            },
            onSelectItem: function (oEvent) {
                var key = oEvent.getSource().getSelectedItem().getKey();
                var item_quantity_input = this.byId(item_quantity_input_id);
                item_quantity_input.setValue("");
                item_quantity_input.setEnabled(true);
                this.byId(item_selection_ok_button_id).setEnabled(false);
                var index = this.bsearch(
                    items,
                    key,
                    0,
                    items.length - 1,
                    function (obj, key) {
                        return obj["id"] - key;
                    }
                );
                item_quantity_input.focus();
            },
            enableItemSelectionDialogOkButton: function (oEvent) {
                var val = oEvent.getSource().getValue();
                var first_char = val.charAt(0);
                var ok_button = this.byId(item_selection_ok_button_id);
                if (val.length <= 0 || first_char == "0" || first_char == "-")
                    ok_button.setEnabled(false);
                else ok_button.setEnabled(true);
            },
            resetItemUnitSelection: function () {
                var tmp = this.byId(item_unit_selection_id);
                tmp.setSelectedItem(tmp.getFirstItem());
            },
            resetItemSelectionList: function () {
                this.byId(item_list_id).clearSelection();
            },
            resetItemQuantityInput: function () {
                var item_quantity_input = this.byId(item_quantity_input_id);
                item_quantity_input.setValue("");
                item_quantity_input.setEnabled(false);
            },
            resetItemSelectionDialog: function () {
                this.resetItemUnitSelection();
                this.resetItemSelectionList();
                this.resetItemQuantityInput();
            },

            openDepartureSelectionDialog: function () {
                var oView = this.getView();
                if (!this.byId(departure_selection_dialog_id)) {
                    Fragment.load({
                        id: oView.getId(),
                        name: departure_selection_dialog_name,
                        controller: this,
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        oDialog.open();
                    });
                } else this.byId(departure_selection_dialog_id).open();
                this.byId(departure_selection_ok_button_id).setEnabled(false);
                var rbg = this.byId(departure_selection_radio_button_group_id);
                rbg.destroyButtons();

                this.type = this.getView()
                    .byId("el9")
                    .getSelectedItem()
                    .getText();
                if (this.type == "Yurtiçi") {
                    for (var i in home_stations)
                        rbg.addButton(
                            new sap.m.RadioButton({
                                text: home_stations[i],
                            })
                        );
                } else {
                    for (var i in abroad_stations)
                        rbg.addButton(
                            new sap.m.RadioButton({
                                text: abroad_stations[i],
                            })
                        );
                }
            },
            onSelectDepartureStation: function () {
                this.byId(departure_selection_ok_button_id).setEnabled(true);
            },
            closeDepartureSelectionDialogOk: function () {
                this.byId(departure_selection_dialog_id).close();

                this.departure_selection_returns = this.byId(
                    departure_selection_radio_button_group_id
                )
                    .getSelectedButton()
                    .getText();
                this.getView().byId("b3").setEnabled(true);
                this.getView()
                    .byId("b2")
                    .setValue(this.departure_selection_returns);
                return this.departure_selection_returns;
            },
            closeDepartureSelectionDialogCancel: function () {
                this.byId(departure_selection_dialog_id).close();
                this.departure_selection_returns = null;
                return null;
            },

            openArrivalSelectionDialog: function () {
                var oView = this.getView();
                if (!this.byId(arrival_selection_dialog_id)) {
                    Fragment.load({
                        id: oView.getId(),
                        name: arrival_selection_dialog_name,
                        controller: this,
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        oDialog.open();
                    });
                } else this.byId(arrival_selection_dialog_id).open();
                this.byId(arrival_selection_ok_button_id).setEnabled(false);
                var rbg = this.byId(arrival_selection_radio_button_group_id);
                var departure_station = this.byId(
                    departure_selection_radio_button_group_id
                )
                    .getSelectedButton()
                    .getText();
                rbg.destroyButtons();

                if (this.type == "Yurtiçi") {
                    for (var i in home_stations) {
                        if (home_stations[i] == departure_station)
                            rbg.addButton(
                                new sap.m.RadioButton({
                                    text: home_stations[i],
                                    enabled: false,
                                })
                            );
                        else
                            rbg.addButton(
                                new sap.m.RadioButton({
                                    text: home_stations[i],
                                })
                            );
                    }
                } else {
                    for (var i in abroad_stations) {
                        if (abroad_stations[i] == departure_station)
                            rbg.addButton(
                                new sap.m.RadioButton({
                                    text: abroad_stations[i],
                                    enabled: false,
                                })
                            );
                        else
                            rbg.addButton(
                                new sap.m.RadioButton({
                                    text: abroad_stations[i],
                                })
                            );
                    }
                }
            },
            onSelectArrivalStation: function () {
                this.byId(arrival_selection_ok_button_id).setEnabled(true);
            },
            closeArrivalSelectionDialogOk: function () {
                this.byId(arrival_selection_dialog_id).close();
                this.arrival_selection_returns = this.byId(
                    arrival_selection_radio_button_group_id
                )
                    .getSelectedButton()
                    .getText();
                this.getView()
                    .byId("b3")
                    .setValue(this.arrival_selection_returns);
                return this.arrival_selection_returns;
            },
            closeArrivalSelectionDialogCancel: function () {
                this.byId(arrival_selection_dialog_id).close();
                this.arrival_selection_returns = null;
                return null;
            },

            openClientSelectionDialog: function () {
                var oView = this.getView();
                if (!this.byId(client_selection_dialog_id)) {
                    Fragment.load({
                        id: oView.getId(),
                        name: client_selection_dialog_name,
                        controller: this,
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        oDialog.open();
                    });
                } else this.byId(client_selection_dialog_id).open();
                this.byId(client_selection_ok_button_id).setEnabled(false);
                var rbg = this.byId(client_selection_radio_button_group_id);
                rbg.destroyButtons();
                for (var i in clients)
                    rbg.addButton(
                        new sap.m.RadioButton({
                            text: clients[i][name_text],
                        })
                    );
            },
            onSelectClient: function () {
                this.byId(client_selection_ok_button_id).setEnabled(true);
            },
            closeClientSelectionDialogOk: function () {
                this.byId(client_selection_dialog_id).close();
                this.client_selection_returns = this.byId(
                    client_selection_radio_button_group_id
                )
                    .getSelectedButton()
                    .getText();
                this.getView()
                    .byId("b1")
                    .setValue(this.client_selection_returns);
                return this.client_selection_returns;
            },
            closeClientSelectionDialogCancel: function () {
                this.byId(client_selection_dialog_id).close();
                this.client_selection_returns = null;
                return null;
            },
            onChangeVagonAdet: function (oEvent) {
                let inputValue = oEvent.getParameters().value;

                let errorText = "";

                try {
                    if (
                        parseInt(inputValue, 10) < 0 ||
                        parseInt(inputValue, 10) > 10
                    ) {
                        errorText =
                            "Vagon sayısı en az 1, en çok 10 olmalıdır.";
                    }
                } catch (err) {
                    errorText = "Vagon sayısı geçerli bir sayı olmalıdır.";
                }

                this.getView().byId("vagonAdetHataMesaji").setText(errorText);
            },
        });
    }
);
