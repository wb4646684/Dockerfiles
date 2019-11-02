AJS.test.require(["jira.webresources:color-picker"], function () {
    "use strict";

    var $ = require('jquery');
    var Backbone = require('backbone');

    module('Sample color collection view', {
        setup: function setup() {
            this.context = AJS.test.mockableModuleContext();

            this.CollectionViewClass = this.context.require('jira/components/color-picker/view/sample-color-collection-view').extend({
                el: '#qunit-fixture'
            });
        }
    });

    test('When icon is clicked, event with appropriate color is triggered', function () {
        var clickedColor = 'clicked color';
        var notClickedColor = 'not clicked color';

        var view = new this.CollectionViewClass({
            collection: new Backbone.Collection([{
                color: clickedColor
            }, {
                color: notClickedColor
            }])
        });
        view.render();

        var onEventStub = sinon.stub();
        view.on('color:selected', onEventStub);

        notOk(onEventStub.called);

        $('#qunit-fixture').find('.sample-color').first().click();

        ok(onEventStub.calledOnce);
        ok(onEventStub.calledWith(clickedColor));
        notOk(onEventStub.calledWith(notClickedColor));
    });
});