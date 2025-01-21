// <nowiki>

mw.loader.using(['mediawiki.util', 'mediawiki.api', 'oojs-ui'], function () {
    'use strict';

    var config = {};

    $.when(
        mw.loader.using(['mediawiki.util', 'mediawiki.api']),
        $.ready
    ).then(function () {

        config.mw = mw.config.get([
            "wgPageName",
            "wgNamespaceNumber",
        ]);

        var API = new mw.Api({
            ajax: {
                headers: {
                    "Api-User-Agent": "User:DreamRimmer/BlankUserPage"
                }
            }
        });

        var isUserPage = config.mw.wgNamespaceNumber === 2 || config.mw.wgNamespaceNumber === 3;
        if (isUserPage) {
            mw.util.addPortletLink('p-cactions', "#", 'BlankPage', 'ca-blankUPage', "Blank User page", null, "#ca-move");
            $('#ca-blankUPage').on('click', function () {
                showBlankOptionsModal();
            });
            return;
        }

        function showBlankOptionsModal() {
            var windowManager = new OO.ui.WindowManager();
            $(document.body).append(windowManager.$element);

            function BlankOptionsDialog(config) {
                BlankOptionsDialog.super.call(this, config);
            }
            OO.inheritClass(BlankOptionsDialog, OO.ui.ProcessDialog);

            BlankOptionsDialog.static.name = 'blankOptionsDialog';
            BlankOptionsDialog.static.title = 'Blank User Page';
            BlankOptionsDialog.static.actions = [
                { action: 'accept', label: 'Blank Page', flags: ['primary', 'progressive'] },
                { action: 'cancel', label: 'Cancel', flags: 'safe' }
            ];

            BlankOptionsDialog.prototype.initialize = function () {
                BlankOptionsDialog.super.prototype.initialize.apply(this, arguments);

                var reasonInput = new OO.ui.TextInputWidget({
                    placeholder: 'Reason for blanking (e.g., Blanked, See [[WP:UPNOT]])',
                    value: 'Blanked, See [[WP:UPNOT]]',
                    multiline: true,
                    rows: 3
                });

                this.content = new OO.ui.PanelLayout({
                    padded: true,
                    expanded: false
                });

                this.content.$element.append(
                    new OO.ui.FieldsetLayout({
                        items: [
                            new OO.ui.FieldLayout(reasonInput, {
                                label: 'Reason for blanking:',
                                align: 'top'
                            })
                        ]
                    }).$element
                );

                this.reasonInput = reasonInput;
                this.$body.append(this.content.$element);
            };

            BlankOptionsDialog.prototype.getActionProcess = function (action) {
                if (action === 'accept') {
                    return new OO.ui.Process(() => {
                        var blankReason = this.reasonInput.getValue();
                        blankUserPageWithoutReplacement(config.mw.wgPageName, blankReason);
                        this.close();
                    });
                } else if (action === 'cancel') {
                    return new OO.ui.Process(() => {
                        this.close();
                    });
                }
                return BlankOptionsDialog.super.prototype.getActionProcess.call(this, action);
            };

            windowManager.addWindows([new BlankOptionsDialog()]);
            windowManager.openWindow('blankOptionsDialog');
        }

        function blankUserPageWithoutReplacement(userPage, reason) {
            var queryParams = {
                action: "edit",
                text: "",
                summary: reason + " using [[User:DreamRimmer/BlankUserPage|BlankUserPage]]",
                nocreate: true,
                title: userPage
            };

            API.postWithToken("csrf", queryParams).then(function () {
                location.reload();
            });
        }
    });
});
// </nowiki>
