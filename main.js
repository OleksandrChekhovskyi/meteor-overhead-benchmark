items = new Mongo.Collection("items");
lists = new Mongo.Collection("lists");

Router.route("/", function() {
	this.render("page"); 
});

Router.route("/:_id", function() {
	this.render("page", {
		data: {
			_id: this.params._id
		}
	});
});

if (Meteor.isClient) {
	Template.list.onCreated(function() {
		this.subscribe("items", this.data._id);
	});

	Template.page.onCreated(function() {
		if (this.data && this.data._id)
			this.subscribe("lists", this.data._id);
	});

	Template.list.helpers({
		items: function() {
			return items.find({
				listId: this._id,
			});
		}
	});

	Template.page.helpers({
		lists: function() {
			if (!this._id)
				return;

			return lists.find({
				pageId: this._id,
			});
		}
	});

	Template.page.events({
		"click button": function() {
			var pageId = Random.id();
			Meteor.call("createPage", pageId);
			window.open("/" + pageId);
		}
	});
}

if (Meteor.isServer) {
	Meteor.publish("lists", function(pageId) {
		return lists.find({
			pageId: pageId,
		});
	});

	Meteor.publish("items", function(listId) {
		return items.find({
			listId: listId,
		});
	});

	Meteor.methods({
		"createPage": function(pageId) {
			for (var i = 0; i < 10; i++) {
				var listId = Random.id();

				lists.insert({
					_id: listId,
					pageId: pageId,
				});

				for (var k = 0; k < 10; k++) {
					items.insert({
						listId: listId,
						text: "item " + k,
					});
				}
			}
		}
	});
}
