// <nowiki>

var config = {};

$.when(
    mw.loader.using(['mediawiki.util', 'mediawiki.api']),
    $.ready
).then(function() {

    config.mw = mw.config.get([
        "wgPageName",
        "wgNamespaceNumber",
    ]);

    var API = new mw.Api({
        ajax: {
            headers: {
                "Api-User-Agent": "userPageBlanking; https://en.wikipedia.org/wiki/User:DreamRimmer/BlankUserPage.js"
            }
        }
    });

    var isUserPage = config.mw.wgNamespaceNumber === 2 || config.mw.wgNamespaceNumber === 3;
    if (isUserPage) {
        mw.util.addPortletLink('p-cactions', "#", 'BlankPage', 'ca-blankUPage', "Blank User page", null, "#ca-move");
        $('#ca-blankUPage').on('click', function() {
            mw.loader.load('User:DreamRimmer/test.css');
            showBlankOptionsModal();
        });
        return;
    }

    function showBlankOptionsModal() {
      
        if ($('#blankOptionsModal').length > 0) {
            return;
        }

        var modalContent = `
            <div id="blankOptionsModal" class="modal" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 600px; max-height: 80%; overflow-y: auto; border: 2px solid #ccc; border-radius: 10px; background-color: #eafafa;">
    <div class="modal-header" style="border-bottom: 1px solid #ccc; padding: 10px;">
        <span class="close" style="float: right; cursor: pointer;">&times;</span>
        <h2 style="margin: 0; display: inline;">BlankUserPage</h2><span style="font-size: 0.9em; margin-left: 6px;">v2.0</span>
    </div>
    <div class="modal-body" style="border-bottom: 1px solid #ccc; padding: 10px;">
        <label for="blankReasonInput" style="margin-bottom: 15px;">Reason for blanking:</label>
        <br>
        <input type="text" id="blankReasonInput" style="width: 99%; height: 50px; margin-bottom: 10px;" value="Blanked, See [[WP:UPNOT]]">
        <br>
        <label for="replaceContentCheckbox" style="margin-bottom: 10px;">
            <input type="checkbox" id="replaceContentCheckbox" unchecked>
            Add {{Userpage blanked}} template. <span style="font-size: 0.6em;">(See <a href="/wiki/Template:Userpage blanked/doc" target="_blank">template documentation</a>)</span>
</label>
    </div>
    <div class="modal-footer" style="padding: 10px; text-align: right;">
        <button id="blankButton" style="background-color: #007bff; color: #fff; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">Blank Page</button>
    </div>
</div>

        `;

        $('body').append(modalContent);

        var modal = document.getElementById("blankOptionsModal");
        var btn = document.getElementById("ca-blankUPage");
        var span = document.getElementsByClassName("close")[0];

        btn.onclick = function() {
            modal.style.display = "block";
        }

        span.onclick = function() {
            modal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        $('#blankButton').on('click', function() {
            var replaceContent = $('#replaceContentCheckbox').is(':checked');
            var blankReason = $('#blankReasonInput').val();
            if (replaceContent) {
                blankUserPageWithReplacement(config.mw.wgPageName, blankReason);
            } else {
                blankUserPageWithoutReplacement(config.mw.wgPageName, blankReason);
            }
            modal.style.display = "none";
        });
    }

    function blankUserPageWithReplacement(userPage, reason) {
        var textToAdd = "{{Userpage blanked}}";

        var queryParams = {
            action: "edit",
            text: textToAdd,
            summary: reason + " using [[User:DreamRimmer/BlankUserPage|BlankUserPage 2.0]]",
            nocreate: true,
            title: userPage
        };

        API.postWithToken("csrf", queryParams).then(function() {
            location.reload(); // Reload the page after blanking
        });
    }

    function blankUserPageWithoutReplacement(userPage, reason) {
        var queryParams = {
            action: "edit",
            text: "",
            summary: reason + " using [[User:DreamRimmer/BlankUserPage|BlankUserPage 2.0]]",
            nocreate: true,
            title: userPage
        };

        API.postWithToken("csrf", queryParams).then(function() {
            location.reload(); 
        });
    }
});
// </nowiki>
