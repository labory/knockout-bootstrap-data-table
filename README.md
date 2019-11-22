Knockout pageable data table
=============================

### Basic
![Basic Example](https://raw.github.com/labory/knockout-bootstrap-data-table/master/assets/basic-example.png)
### View

    <table data-bind="dataTable: tableViewModel"><!-- --></table>

### ViewModel

    $(function () {
        var ExamplePageViewModel = function() {
            var self = this;
            self.getData = function (page, size, callback) {
                var params = "?page.page=" + (page) + "&page.size=" + size;
                $.getJSON("/frameworks" + params, callback);
            };
            self.tableViewModel = new ko.dataTable.ViewModel({
                columns: [
                    { name: "FRAMEWORK", value: "name" },
                    { name: "LICENSE", value: "license" },
                    { name: "DEPENDENCY", value: "dependency" },
                    { name: "SIZE (Gzipped)", value: function (item) { return item.size != '' ? item.size + ' kb' : ''} }
                ],
                loader: self.getData,
                pageSize: 10
            });
        };
        ko.applyBindings(new ExamplePageViewModel());
    });
    
### Custom Template
![Basic Example](https://raw.github.com/labory/knockout-bootstrap-data-table/master/assets/custom-template-example.png)

### View
    <table data-bind="dataTable: tableViewModel, tableHeaderTemplate: 'dataTableCustomHeaderTemplate'"><!-- --></table>

    <script type="text/html" id="dataTableCustomHeaderTemplate">
        <![CDATA[
        <thead>
        <tr>
            <th colspan="4">Comparison of JavaScript frameworks</th>
        </tr>
        <tr>
            <th>FRAMEWORK</th><th>LICENSE</th><th>DEPENDENCY</th><th>SIZE (Gzipped)</th>
        </tr>
        </thead>
         ]]>
    </script>

### ViewModel
        $(function () {
            var ExamplePageViewModel = function() {
                var self = this;
                self.getData = function (page, size, callback) {
                    var params = "?page.page=" + (page) + "&page.size=" + size;
                    $.getJSON("/frameworks" + params, callback);
                };
                self.tableViewModel = new ko.dataTable.ViewModel({
                    columns: [
                        { name: "", value: "name" },
                        { name: "", value: "license" },
                        { name: "", value: "dependency" },
                        { name: "", value: function (item) { return item.size != '' ? item.size + ' kb' : ''} }
                    ],
                    loader: self.getData,
                    pageSize: 10
                });
            };
            ko.applyBindings(new ExamplePageViewModel());
        });
    
### Possible Backend Implementation (Spring Data)

    @RequestMapping(value = "/frameworks", method = RequestMethod.GET, produces = "application/json")
    public @ResponseBody Page<Framework> getFrameworks(@PageableDefaults(
            pageNumber = 0, value = 10, sort = "name", sortDir = Sort.Direction.ASC) Pageable pageable) {
        return frameworkRepository.findAll(pageable);
    }


### Dependencies
  * Knockout
  * Jquery
  * bootstrap pagination css
