var tracking_codes = {};
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

                    tracking_codes[data[i]["Codigo de Seguimiento"]] = {};
                    tracking_codes[data[i]["Codigo de Seguimiento"]]['item'] = data[i]["Item"];
                    tracking_codes[data[i]["Codigo de Seguimiento"]]['days'] = data[i]["Demora"];
                    tracking_codes[data[i]["Codigo de Seguimiento"]]['commentary'] = data[i]["Comentario"];
                }
            };

            $.each(codes, function(index, value) {

                $("#results").append(
                    `<tr  id='result'>
                        <td  id='days'>` + days[index] + `</td>
                        <td  id='code'>` 	+ value + `</td>
                        <td  id='item'>` + items[index] + `</td>
                        <td id='state'>loading</td><td  id='date'>loading</td>
                        <td  id='date'>
                            <div class='btn-group' role='group'>
                                <a target=_blank href=https://t.17track.net/es#nums=`+value+` type='button' class='btn btn-primary'><i class='fas fa-globe-americas'></i></a>
                                <a target=_blank href=https://seguimientoenvio.correos.cl/home/index/`+value+` type='button' class='btn btn-primary'><i class='fas fa-home'></i></a>
                                <button value=`+value+` type='button' class='btn btn-info' onclick='moreinfo(this.value)'><i class='fas fa-search'></i></button>
                            </div>
                        </td>
                    </tr>`)

            });
        },
        complete: function(data) {
            var results_table = $("#results").DataTable({
                "paging":false,
                "aaSorting": [0, 'desc'],
                "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                            if ( aData[3].includes("ENVIO ENTREGADO") || aData[3].includes("SUCURSAL LA CISTERNA"))
                            {
                                $(nRow).addClass("table-success");
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
                            tracking_codes[data['Codigo']]['log'] = data['historial']
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
function moreinfo(value) {
    $("#moreinfoTitle").html( value );+
    $("#itemModal").html( tracking_codes[value]['item'] );
    $("#commentaryModal").html( tracking_codes[value]['commentary'] );
    $("#daysModal").html( tracking_codes[value]['days'] );
    $("#logModal").html('')
    $.each(tracking_codes[value]['log'], function (index, entry) {
        console.log(entry)
        $("#logModal").append(
            `<tr>
                <td>` + entry['Estado'] + `</td>
                <td>` 	+ entry['Fecha'] + `</td>
                <td>` + entry['Oficina'] + `</td>
            </tr>`)
    })
    $('#moreinfo').modal('show');
    // console.log(tracking_codes[value]);
}