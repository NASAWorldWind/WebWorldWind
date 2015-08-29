/**
 * Created by Matthew on 8/4/2015.
 */

define(function () {
    "use strict";

    var CommandsPanel = function (id, parentNode) {
        var self = this;
        self._id = id;
        self._parentNode = $(parentNode);

        self._anchor = $('<div>');
        self._anchor.attr('id',  self._id);

        self._buttons = [];

        self.initPanel();
    };

    CommandsPanel.prototype.initPanel = function(){
        var self = this;
        var panelDropdownButton = $('<button>');
        panelDropdownButton.attr("type",'button')
        panelDropdownButton.attr("class","btn btn-info btn-block dropdown-toggle");
        panelDropdownButton.attr("data-toggle","collapse");
        panelDropdownButton.attr("data-target","#cp" + self._id);
        panelDropdownButton.text("Panel");
        panelDropdownButton.append('<span class="' + 'caret' + '"></span>')
        var panelDropdownButtonDiv = $("<div>");
        panelDropdownButtonDiv.attr("id","cp" + self._id);
        panelDropdownButtonDiv.attr("class","collapse");
        var panelList = $("<div>");
        panelList.attr('class','list-group');
        panelList.attr('id','CPanel' + self._id);
        panelDropdownButtonDiv.append(panelList);
        self._panelList = panelList;
        self._anchor.append(panelDropdownButton);
        self._anchor.append(panelDropdownButtonDiv);
        self._parentNode.append(self._anchor);

    };

    CommandsPanel.prototype.addButton = function(buttonName, buttonFunction){
        var self = this;

        var primaryButtonDiv = $("<div>");
        primaryButtonDiv.attr("class","btn-group btn-group-justified");
        var secondaryButtonDiv = $("<div>");
        secondaryButtonDiv.attr("class", "btn-group");
        var button = $('<button>');
        button.attr("class","btn btn-primary");
        button.attr("id","Button" + buttonName);
        button.text(buttonName);
        if (buttonFunction){
            button.on("click",
                buttonFunction
            );
        }
        secondaryButtonDiv.append(button);
        primaryButtonDiv.append(secondaryButtonDiv);
        self._panelList.append(primaryButtonDiv);
    };

    return CommandsPanel;
});
