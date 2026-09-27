function createContent(designation, list, sequence, type, data) {
    let html="", find = false, sl = 0;

    if(type === "DOM-READY") { // document.ready
        for(let i=0; i<list.length; i++) {
            if(list[i].shift_id == data["selectedShift"]) {
              find=true;
              html += `<tr class="align-middle" id="${designation}_proxy_tr_${list[i].id}_${sl}">
                                        <td style="width: 25%;" id="${designation}_proxy_${list[i].id}"> 
                                            <div class="form-check"> 
                                                <input class="form-check-input" type="checkbox" onclick="proxyOperation('${designation}', '${list[i].id}', ${sl});" id="${designation}_${list[i].id}" style="cursor: pointer;"/>
                                                <label class="form-check-label" for="${designation}_${list[i].id}" style="cursor: pointer;">${list[i].name}<br>(${list[i].employee_id})</label
                                            </div>
                                        </td>
                                        <td id="${designation}_proxy_details_${list[i].id}">
                                            <div class="row pt-1 pb-1" id="${designation}_proxy_div_${sequence}_${list[i].id}">
                                                <div class="col-2">
                                                    <label for="${designation}_duty_type_${sequence}_${list[i].id}" class="form-label visually-hidden">Duty type</label>
                                                    <select class="form-select" id="${designation}_duty_type_${sequence}_${list[i].id}" disabled>
                                                        <option value="Proxy">Proxy</option>
                                                        <option value="Swap">Swap</option>
                                                    </select>
                                                    <div id="error_${designation}_duty_type_${sequence}_${list[i].id}"></div>
                                                </div>
                                                <div class="col-4">
                                                <label for="${designation}_list_${sequence}_${list[i].id}" class="form-label visually-hidden">${designation} list</label>
                                                    <select class="form-select ${designation}_list" id="${designation}_list_${sequence}_${list[i].id}" disabled>
                                                        <option></option>
                                                    </select>
                                                    <div id="error_${designation}_list_${sequence}_${list[i].id}"></div>
                                                </div>
                                                <div class="col-3">
                                                    <label for="${designation}_start_time_${sequence}_${list[i].id}" class="form-label visually-hidden">Start time</label>
                                                    <select class="form-select timepicker_list" id="${designation}_start_time_${sequence}_${list[i].id}" disabled>
                                                        <option></option>
                                                    </select>
                                                    <div id="error_${designation}_start_time_${sequence}_${list[i].id}"></div>
                                                </div>
                                                <div class="col-2">
                                                    <label for="${designation}_duration_${sequence}_${list[i].id}" class="form-label visually-hidden">Duration</label>
                                                    <input  type="number" class="form-control ${designation}_duration_${list[i].id}" id="${designation}_duration_${sequence}_${list[i].id}" onchange="durationCalculation('${designation}', '${list[i].id}', 0);" disabled placeholder="Duration"/>
                                                    <div id="error_${designation}_duration_${sequence}_${list[i].id}"></div>
                                                </div>
                                                <div class="col-1">
                                                    <button type="button" class="btn btn-sm btn-outline-success" id="${designation}_add_${list[i].id}" onclick="add('${designation}', '${list[i].id}', ${sl});" disabled><strong>+</strong>
                                                </div>
                                            </div>
                                        </td>
                                      </tr>`;
              sl++;
            }
        }

    } else if(type === "SHIFT-D-E") {
        let selected_employee = $(`#shift_${designation}`).val();
        for(let i=0; i<list.length; i++) {
          if(selected_employee.includes(list[i].id)) {
            find=true;
            html += `<tr class="align-middle" id="${designation}_proxy_tr_${list[i].id}_${sl}">
                    <td style="width: 25%;" id="${designation}_proxy_${list[i].id}"> 
                        <div class="form-check"> 
                        <input class="form-check-input" type="checkbox" onclick="proxyOperation('${designation}', '${list[i].id}', ${sl});" id="${designation}_${list[i].id}" style="cursor: pointer;"/>
                        <label class="form-check-label" for="${designation}_${list[i].id}" style="cursor: pointer;">${list[i].name}<br>(${list[i].employee_id})</label>
                        </div>
                    </td>
                    <td id="${designation}_proxy_details_${list[i].id}">
                    <div class="row pt-1 pb-1" id="${designation}_proxy_div_0_${list[i].id}">
                        <div class="col-2">
                            <label for="${designation}_duty_type_0_${list[i].id}" class="form-label visually-hidden">Duty type</label>
                            <select class="form-select" id="${designation}_duty_type_0_${list[i].id}" disabled>
                                <option value="Proxy">Proxy</option>
                                <option value="Swap">Swap</option>
                            </select>
                            <div id="error_${designation}_duty_type_0_${list[i].id}"></div>
                        </div>
                        <div class="col-4">
                            <label for="${designation}_list_0_${list[i].id}" class="form-label visually-hidden">${designation} list</label>
                            <select class="form-select ${designation}_list" id="${designation}_list_0_${list[i].id}" disabled>
                                <option></option>
                            </select>
                            <div id="error_${designation}_list_0_${list[i].id}"></div>
                        </div>
                        <div class="col-3">
                        <label for="${designation}_start_time_0_${list[i].id}" class="form-label visually-hidden">Start time</label>
                            <select class="form-select timepicker_list" id="${designation}_start_time_0_${list[i].id}" disabled>
                                <option></option>
                            </select>
                            <div id="error_${designation}_start_time_0_${list[i].id}"></div>
                        </div>
                        <div class="col-2">
                            <label for="${designation}_duration_0_${list[i].id}" class="form-label visually-hidden">Duration</label>
                            <input  type="number" class="form-control ${designation}_duration_${list[i].id}" id="${designation}_duration_0_${list[i].id}" onchange="durationCalculation('${designation}', '${list[i].id}', 0);" disabled placeholder="Duration"/>
                            <div id="error_${designation}_duration_0_${list[i].id}"></div>
                        </div>
                        <div class="col-1">
                            <button type="button" class="btn btn-sm btn-outline-success" id="${designation}_add_${list[i].id}" onclick="add('${designation}', '${list[i].id}', ${sl});" disabled><strong>+</strong>
                        </div>
                    </div>
                    </td>
                </tr>`;
            sl++;
          }
        }

    }  else if(type === "ADD") {
        find = true;
        let id = data['id'];
        html = `<div class="col-2">
                    <label for="${designation}_duty_type_${sequence}_${id}" class="form-label visually-hidden">Duty type</label>
                    <select class="form-select" id="${designation}_duty_type_${sequence}_${id}">
                        <option value="Proxy">Proxy</option>
                        <option value="Swap">Swap</option>
                    </select>
                </div>
                <div class="col-4">
                    <label for="${designation}_list_${sequence}_${id}" class="form-label visually-hidden">${designation} list</label>
                    <select class="form-select ${designation}_list" id="${designation}_list_${sequence}_${id}">
                    ${JSON.parse(list).map((item, i) => `
                        <option></option>
                        <option value="${item.id}">(${item.shift_name}-${item.employee_id}) ${item.name}</option>`
                    )}
                    </select>
                    <div id="error_${designation}_list_${sequence}_${id}"></div>
                </div>
                <div class="col-3">
                    <label for="${designation}_start_time_${sequence}_${id}" class="form-label visually-hidden">Start time</label>               
                    <select class="form-select timepicker_list" id="${designation}_start_time_${sequence}_${id}">
                    <option></option>
                    </select>
                    <div id="error_${designation}_start_time_${sequence}_${id}"></div>
                </div>
                <div class="col-2">
                    <label for="${designation}_duration_${sequence}_${id}" class="form-label visually-hidden">Duration</label>
                    <input  type="number" class="form-control ${designation}_duration_${id}" id="${designation}_duration_${sequence}_${id}" onchange="durationCalculation('${designation}', '${id}', ${sequence});" value="${data['new_duration']}" placeholder="Duration"/>
                    <div id="error_${designation}_duration_${sequence}_${id}"></div>
                </div>
                <div class="col-1">
                    <button type="button" class="btn btn-sm btn-outline-danger" id="${designation}_remove_${sequence}_${id}" onclick="remove('${id}', '${designation}_proxy_div_${sequence}_${id}', '${sequence}');"><strong>x</strong>
                </div>`;
    }


    if(!find) {
        html = `<tr class="align-middle"><td colspan="3" class="text-danger">No record found!</td></tr>`;
        document.querySelector("#submit_btn").disabled = true;
    }   
    return {
        "find": find,
        "html": html
    };
}