// Knockout bootstrap pageable data table

(function () {

    ko.dataTable = {
        ViewModel: function (config) {
            self = this;

            self.loader  = config.loader;
            self.items = ko.observableArray(config.items || []);
            self.columns = config.columns;
            self.totalPages = ko.observable();
            self.pageIndex = ko.observable(0);
            self.pageSize = ko.observable(config.pageSize || 10);
            self.isFirstPage = ko.computed(function () {return self.pageIndex() === 0});
            self.isLastPage = ko.computed(function () {return self.pageIndex() === self.totalPages() - 1});
            self.prevPage = function () {
                if (self.pageIndex() > 0) {
                    self.pageIndex(self.pageIndex() - 1);
                }
            };
            self.nextPage = function () {
                if (self.pageIndex() < self.totalPages() - 1) {
                    self.pageIndex(self.pageIndex() + 1);
                }
            };
            self.moveToPage = function (index) {
                console.log("goto: " + index);
                self.pageIndex(index - 1);
            };
            self.reload = function() {
                self.loader(self.pageIndex() + 1, self.pageSize(), function (data) {
                    console.log("page - get : " + self.pageIndex() + " ;sent: " + data.number);
                    console.log("size - get : " + self.pageSize() + " ;sent: " + data.size);
                    console.log("total : " + data.totalPages);
                    self.items(data.content);
                    self.pageIndex(Math.min(data.number, data.totalPages - 1));
                    self.totalPages(data.totalPages);
                    self.pageSize(data.size);
                });
            };
            self.content = ko.computed(self.reload);
        }
    };

    var templateEngine = new ko.nativeTemplateEngine();

    templateEngine.addTemplate = function(templateName, templateMarkup) {
        document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "<" + "/script>");
    };

    templateEngine.addTemplate("ko_table_header", "\
                        <thead>\
                            <tr data-bind=\"foreach: columns\">\
                               <th data-bind=\"text: name\"></th>\
                            </tr>\
                        </thead>");

    templateEngine.addTemplate("ko_table_body", "\
                        <tbody data-bind=\"foreach: items\">\
                           <tr data-bind=\"foreach: $parent.columns\">\
                               <td data-bind=\"text: typeof value == 'function' ? value($parent) : $parent[value] \"></td>\
                            </tr>\
                        </tbody>");
    templateEngine.addTemplate("ko_table_pager", "\
        <tfoot>\
        <tr>\
        <td colspan=\"10\">\
            <div data-bind=\"foreach: [10, 25, 50, 100]\">\
                <a href=\"#\" data-bind=\"disable: ($data == $root.pageSize()), style : {fontWeight : ($data == $root.pageSize()) ? 'bold' : ''}, text: $data + ' ', click: function() { $root.pageSize($data) }\"/>\
            </div>\
            <div class=\"pagination\" data-bind=\"if: totalPages() > 1\">\
                <ul>\
                    <li data-bind=\"css: { disabled: isFirstPage() }\">\
                        <a href=\"#\" data-bind=\"click: prevPage\">«</a>\
                    </li>\
                    <!-- ko foreach: ko.utils.range(1, totalPages()) -->\
                    <li data-bind=\"css: { active: $data === ($root.pageIndex() + 1)}\">\
                        <a href=\"#\" data-bind=\"text: $data, click: $root.moveToPage\"/>\
                    </li>\
                    <!-- /ko -->\
                    <li data-bind=\"css: { disabled: isLastPage() }\">\
                        <a href=\"#\" data-bind=\"click: nextPage\">»</a>\
                    </li>\
                </ul>\
            </div>\
        </td>\
        </tr>\
    </tfoot>");

    ko.bindingHandlers.dataTable = {
        init:function (element, valueAccessor) {
            return { 'controlsDescendantBindings':true };
        },
        update:function (element, valueAccessor, allBindingsAccessor) {
            var viewModel = valueAccessor(), allBindings = allBindingsAccessor();

            var tableHeaderTemplateName = allBindings.tableHeaderTemplate || "ko_table_header",
                tableBodyTemplateName = allBindings.tableBodyTemplate || "ko_table_body",
                tablePagerTemplateName = allBindings.tablePagerTemplate || "ko_table_pager";

            var table = $(document.createElement('table')).addClass("table table-bordered table-hover")[0];

            // Render table header
            var headerContainer = table.appendChild(document.createElement("DIV"));
            ko.renderTemplate(tableHeaderTemplateName, viewModel, { templateEngine: templateEngine }, headerContainer, "replaceNode");

            // Render table body
            var bodyContainer = table.appendChild(document.createElement("DIV"));
            ko.renderTemplate(tableBodyTemplateName, viewModel, { templateEngine: templateEngine }, bodyContainer, "replaceNode");

            // Render table pager
            var pagerContainer = table.appendChild(document.createElement("DIV"));
            ko.renderTemplate(tablePagerTemplateName, viewModel, { templateEngine: templateEngine }, pagerContainer, "replaceNode");

            $(element).replaceWith($(table));
        }
    };
})();