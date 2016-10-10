# hacknlove:semantic-form

## use:

### Template
    {{#semanticForm name="foo" fields=bar ready=baz values=qux}}
      <form class="ui form">
        <!-- only one form inside the semanticForm -->
        <!-- you have the helpers current, actual and reload -->
        <div class="ui error message"></div> <!-- do not forget this-->
      </form>
    {{/semanticForm}}

* `name` (optional but recomended) sets the `_id` of the documents in the Template.semanticForm.current and Template.semanticForm.reload that host the current values in the form and those who has been changed` you must set a name if you want your form keep the values that has been changed in the form but has not been saved, even if the template is destroyed
* `fields` the fields object to be passed to the `$(form).form({fields: bar})`
* `ready` semanticForm will wait until `ready` was not falsable
* `values` has the values with what semanticForm will populate the form widgets by their names

### Events:
* `success` fired when you submit the form, and it pass the validation
* `failure` fired when you submit the form, and it does not pass the validation


      Template.foo.events({
        'form success': function (event, instance, data, add) {
          // data <= $('form').form('get values')
          // add.prompt('bar') => mark input as error
          // add.errors(['bla', 'blabla', ...]) =>  show the errors
        }
      })

### Special validation
On top of the semantic-ui validations, semantic-form has the `event` validation

**js**

    Template.foo.helpers({
      values: {...},
      fields: {
        bar: {
          rules: [
            {
              type: 'event[baz]',
              prompt: 'some error message'
            }
          ]
        }
      }
    })

    Template.foo.events({
      'validate input[name=bar]': function (event, instance, param) {
        // here you can do your custom validation accesing your Template, the doom, whatever you need, but remember that it must be synchronous
      }
    })

**html**

    <template name="foo">
      {{#semanticForm name="qux" fields=fields ready=true values=values}}
        <form class="ui form">
          <div class="field">
            <label>BAR</label>
            <input type="text" name="bar">
          </div>
          <div class="ui error message"></div>
        </form>
      {{/semanticForm}}
    </template>
