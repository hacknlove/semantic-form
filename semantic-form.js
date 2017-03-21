/* globals Mongo, Template, Meteor, $ */

Meteor.startup(function () {
  Template.semanticForm.collection = new Mongo.Collection(null)
  Template.semanticForm.reload = new Mongo.Collection(null)
  if ($.fn.form) {
    $.fn.form.settings.rules.event = function (value, param) {
      return this.triggerHandler('validate', param)
    }
  } else {
    console.error('have you installed semantic:ui?')
  }
})

Template.semanticForm.onCreated(function () {
  if (!this.data.name) {
    this.data.name = Meteor.uuid()
  }
})

Template.semanticForm.onRendered(function () {
  var form = this.$('form')
  form.find('.ui.checkbox').checkbox()
  form.addClass('loading')
  var that = this

  var config = {
    onSuccess: function (event, data) {
      form.trigger('success', [data, form.form('add')])
      return false
    },
    onFailure: function () {
      var data = form.form('get values')
      form.trigger('failure', [data, form.form('add')])
      return false
    }
  }
  if (this.data.fields) {
    config.fields = this.data.fields
  }

  form.form(config)

  this.autorun(function (computation) {
    if (!Template.currentData().ready) {
      return
    }
    form.removeClass('loading')

    var current = Template.semanticForm.collection.findOne({_id: that.data.name})
    if (!current) {
      current = that.data.values || {}
      current._id = that.data.name
      Template.semanticForm.collection.insert(current)
      Template.semanticForm.reload.insert({_id: that.data.name})
    }
    form.form('set values', current)
    computation.stop()
  })

  this.autorun(function () {
    var data = Template.currentData()
    if (!data.ready) {
      return
    }

    var actual = Template.currentData().values || {}
    delete actual._id
    var current = Template.semanticForm.collection.findOne({_id: that.data.name}) || {}
    var $set = {
      __any: false
    }
    Object.keys(actual).forEach(function (name) {
      if (actual[name] !== current[name]) {
        $set[name] = true
        $set.__any = true
      }
    })
    Template.semanticForm.reload.update({_id: data.name}, {$set: $set})
  })
})

Template.semanticForm.events({
  'keyup input, change input, keyup textarea, change textarea': function (event, template) {
    if (event.currentTarget.type === 'file') {
      return
    }
    if (!event.currentTarget.name) {
      return
    }
    template.$(event.currentTarget).parents('.field').removeClass('error')
    Template.semanticForm.collection.update({_id: Template.currentData().name}, {$set: {[event.currentTarget.name]: event.currentTarget.value}})
  },
  'click .reset': function (event, template) {
    template.$('form').form('set values', {})
  },
  'click .reload': function (event, template) {
    var targets = event.currentTarget.dataset.target || event.currentTarget.dataset.targets
    if (targets) {
      targets.split(' ').forEach(function (target) {
        template.$('form').form('set value', target, Template.instance().data.values[target])
      })
    } else {
      template.$('form').form('set values', Template.instance().data.values)
      delete Template.instance().data.values._id
      Template.semanticForm.collection.update({_id: Template.instance().data.name}, {$set: Template.instance().data.values})
    }
    event.preventDefault()
  }
})

Template.semanticForm.helpers({
  current: function (pedo) {
    return Template.semanticForm.collection.findOne({_id: Template.currentData().name})
  },
  actual: function () {
    return Template.instance().data.values
  },
  reload: function () {
    return Template.semanticForm.reload.findOne({_id: Template.currentData().name})
  }
})
