$(document).ready(function() {
    var codes = [];
    var items = [];
    var days = [];
    $.ajax({
        dataType: "json",
        url: "codes.php",
        success: function(data) {

            for (var i = 0; i < data.length; i++) {
                if (data[i]["Estado"] != "Recibido" && data[i]["Codigo de Seguimiento"].length != 0) {
                    codes.push(data[i]["Codigo de Seguimiento"]);
                    items.push(data[i]["Item"]);
                    days.push(data[i]["Demora"]);
                }
            };

            $.each(codes, function(index, value) {

                $("#results").append("<tr  id='result'>" + "<td  id='days'>" + days[index] + "</td>" + "<td  id='code'>" 	+ value + "</td>" + "<td  id='item'>" + items[index] + "</td>" + "<td id='state'>" + 'loading' + "</td>" +  "<td  id='date'>" + 'loading' + "</td>" + "<td  id='date'>" + '<div class="btn-group" role="group"><a target=_blank href=https://t.17track.net/es#nums='+value+' type="button" class="btn btn-primary"><i class="fas fa-globe-americas"></i></a><a target=_blank href=https://seguimientoenvio.correos.cl/home/index/'+value+' type="button" class="btn btn-primary"><i class="fas fa-home"></i></a></div>' + "</td>" + "</tr>")


            });
        },
        complete: function(data) {
            var results_table = $("#results").DataTable({
                "paging":false,
                "aaSorting": [0, 'desc'],
                "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                            if ( aData[3].includes("ENVIO ENTREGADO") || aData[3].includes("SUCURSAL LA CISTERNA"))
                            {
                                $('td', nRow).addClass("table-success");
                            }
        
                        }
            });
            $('#results > tbody  > tr').each(function() {
                code = $(this).find("#code").text();
                var $this = $(this);
                $.ajax({
                    dataType: "json",
                    url: "api.php?code=" + code,
                    success: function(data) {
                        if (data['historial'].length > 0) {
                            state = data['historial'][0]['Estado'];
                            place = data['historial'][0]['Oficina'];
                            date = data['historial'][0]['Fecha'];
                            results_table.cell($this.find("#state")).data(state+"<br>"+'<small class="text-muted">'+place + '</small>')
                            results_table.cell($this.find("#date")).data(date)
                        } else {
                            results_table.cell($this.find("#state")).data('error')
                            results_table.cell($this.find("#date")).data('error')
                        }
                        
                    },
                    complete: function() {
                        results_table.draw();
                    },
                    error: function() {
                        
                    },
    
                    async: true,
                });
                
            });
            
        },
        async: true,
    });
});