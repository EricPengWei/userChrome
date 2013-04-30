// ==UserScript==
// @name            Add Bookmark Here
// @namespace       http://script.bitcp.com/addbookmarkhere
// @description     add "Add Bookmark Here" contextmenu in places menu
// @author          zbinlin
// @homepage        http://bitcp.com
// @include        main
// @include        chrome://browser/content/places/places.xul
// @include        chrome://browser/content/bookmarks/bookmarksPanel.xul
// @version         0.0.1
// @note            modify by lastdream 2013: support sidebar addbookmarkhere
// ==/UserScript==

(function () {
    if (window.AddBookmarkHere) return;
    var AddBookmarkHere = {
        init: function () {
            var placesContext = document.getElementById("placesContext");
            if (!placesContext) return;
            var self = this;
            window.addEventListener("unload", function (e) {
                window.removeEventListener("unload", arguments.callee, false);
                self.uninit();
            }, false);
            this.addContextMenu(placesContext, document.getElementById("placesContext_new:bookmark"));
            /*
            var node = document.getElementById("placesContext_createBookmark");
            if (!node) return;
            node.removeAttribute("forcehideselection");
            node.setAttribute("selection", "any"); 
            node.removeAttribute("command");
            node.setAttribute("oncommand", "AddBookmarkHere.addBookmark(event);");
            */
        },
        addContextMenu: function (parentNode, afterNode) {
            var menuitem = document.createElement("menuitem");
            menuitem.id = "placesContext_add:bookmark";
            menuitem.setAttribute("label", "\u6DFB\u52A0\u5230\u8FD9\u91CC");
            menuitem.setAttribute("accesskey", "h");
            menuitem.setAttribute("selection", "any");
            menuitem.addEventListener("command", this.addBookmark, false);
            parentNode.insertBefore(menuitem, afterNode);
        },
        addBookmark: function (e) {
            var popupNode = e.currentTarget.parentNode.triggerNode;
            if (!popupNode) return;
            var view = PlacesUIUtils.getViewForNode(popupNode);
            if (!view) return;
            var bookmarks = Cc["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Ci.nsINavBookmarksService);
            var selectedNode = view.selectedNode;
            var iid, aid;
            if (selectedNode) {
                if (PlacesUtils.nodeIsFolder(selectedNode) && !PlacesUtils.nodeIsLivemarkContainer(selectedNode) && !PlacesUtils.isReadonlyFolder(selectedNode)) {
                    iid = selectedNode.itemId;
                    aid = e.shiftKey ? 0 : bookmarks.DEFAULT_INDEX;
                } else {
                    iid = bookmarks.getFolderIdForItem(selectedNode.itemId);
                    var id = bookmarks.getItemIndex(selectedNode.itemId);
                    aid = e.shiftKey ? id : id + 1;
                }
            } else {
                iid = view.result.root.folderItemId;
                aid = e.shiftKey ? 0 : bookmarks.DEFAULT_INDEX;
            }
            //var doc = gBrowser.getBrowserForTab(gBrowser.mCurrentTab).contentDocument;
var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                       .getInterface(Components.interfaces.nsIWebNavigation)
                       .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                       .rootTreeItem
                       .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                       .getInterface(Components.interfaces.nsIDOMWindow);
var doc = mainWindow.gBrowser.getBrowserForTab(mainWindow.gBrowser.mCurrentTab).contentDocument; 
            var uri = Services.io.newURI(doc.location.toString(), null, null);
            var title = doc.title;
            bookmarks.insertBookmark(iid, uri, aid, title);
        },
        uninit: function () {
            try {
                var menuitem = document.getElementById("placesContext_add:bookmark");
                menuitem.removeEventListener("command", this.addBookmark, false);
            } catch (ex) {
            }
        }
    };

        AddBookmarkHere.init();
        window.AddBookmarkHere = AddBookmarkHere;

})();
