(function($R)
{
    $R.add('plugin', 'addimage', {
        translations: {
            'zh_tw': {
                'addimage': '插入圖片',
                'src': '圖片網址',
                'title': '圖片標題',
                'caption': '圖片說明',
            }
        },
        modals: {
            'addimage':
                '<form action=""> \
                    <div class="form-item"> \
                        <label for="input-src">## src ##<span class="req">*</span></label> \
                        <input type="text" id="input-src" name="inputSrc" value=""> \
                    </div> \
                    <div class="form-item"> \
                        <label for="input-title">## title ##</label> \
                        <input type="text" id="input-title" name="inputTitle" value=""> \
                    </div> \
                    <div class="form-item"> \
                        <label for="input-caption">## caption ##</label> \
                        <input type="text" id="input-caption" name="inputCaption" value=""> \
                    </div> \
                </form>'
        },
        init: function(app)
        {
            this.app = app;
            this.lang = app.lang;
            this.opts = app.opts;
            this.toolbar = app.toolbar;
            this.component = app.component;
            this.insertion = app.insertion;
            this.inspector = app.inspector;
        },
        // messages
        onmodal: {
            'addimage': {
                opened: function($modal, $form)
                {
                    $form.getField('inputSrc').focus();
                },
                insert: function($modal, $form)
                {
                    var data = $form.getData();
                    this._insert($form, data);
                }
            }
        },
        oncontextbar: function(e, contextbar)
        {
            var data = this.inspector.parse(e.target)
            if (data.isComponentType('addimage'))
            {
                var node = data.getComponent();
                var buttons = {
                    "remove": {
                        title: this.lang.get('delete'),
                        api: 'plugin.addimage.remove',
                        args: node
                    }
                };

                contextbar.set(e, node, buttons, 'bottom');
            }

        },

        // public
        start: function()
        {
            var obj = {
                title: this.lang.get('addimage'),
                api: 'plugin.addimage.open'
            };

            var $button = this.toolbar.addButtonAfter('image', { title: this.lang.get('addimage') }, obj);
            $button.setIcon('<i class="re-icon-image"></i>');
        },
        open: function()
		    {
            var options = {
                title: this.lang.get('addimage'),
                width: '600px',
                name: 'addimage',
                handle: 'insert',
                commands: {
                    insert: { title: this.lang.get('insert') },
                    cancel: { title: this.lang.get('cancel') }
                }
            };

            this.app.api('module.modal.build', options);
		    },
        remove: function(node)
        {
            this.component.remove(node);
        },

        // private
        _insert: function($form, data)
        {
            if (data.inputSrc.trim() === '') {
                $form.setError('inputSrc');
                return;
            }

            var $figure = $R.dom('<figure />');

            // inserting
            var $img = $R.dom('<img />');
            $img.attr('src', data.inputSrc);
            var title = data.inputTitle.trim().replace(/(<([^>]+)>)/ig,'');
            if (title) { $img.attr('alt', title); }
            $figure.append($img);

            var caption = data.inputCaption.trim().replace(/(<([^>]+)>)/ig,'');
            if (caption) {
              $figcaption = $R.dom('<figcaption>');
              $figcaption.attr('contenteditable', 'true');
              $figcaption.html(caption);
              $figure.append($figcaption);
            }

            this.insertion.insertHtml($figure);

            this.app.api('module.modal.close');
        }
    });
})(Redactor);
