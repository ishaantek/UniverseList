window.initiateMulti = function (){
    var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    var uniqid = randLetter + Date.now();
    $('.multiselect').each(function(i, obj) {
        $(obj).hide()
        $(obj).attr("data-link", uniqid)
        const oldhtml = $(obj).parent().html()
        
        function insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }
        var newDiv = document.createElement('div')
        newDiv.setAttribute("data-linked", uniqid)
        newDiv.className = "multiselect-wrapper" 
        
        insertAfter(newDiv, obj)
        $(newDiv).html(`
        <div class="form-control multiselect-input"></div>
        <div class="multiselect-list"></div>
        `)
        console.log($(obj).attr('data-link'))
        const multiselectWrapper = $(`[data-linked=${$(obj).attr('data-link')}]`)
        const multiselectAttr = `[data-linked=${$(obj).attr('data-link')}]`
        const multiselectInput = $(`${multiselectAttr} > .multiselect-input`)
        const multiselectList = $(`${multiselectAttr} > .multiselect-list`)
        $(multiselectList).hide()
        var innerHTML = ""
        var selectedItems = $(obj).val()
        $(`[data-link=${$(obj).attr("data-link")}] > option`).each(function(i, obj){
            innerHTML += `<div data-value="${$(obj).val()}">${$(obj).val()}</div>`
        })
        $(multiselectList).html(innerHTML)
        $(multiselectInput).click((e)=>{
            if ($(e.target).attr("class") == multiselectInput.attr("class")){
                multiselectInput.toggleClass('multiselect-input-active')
                multiselectList.fadeToggle(100)
            }
        })
        function genHTMLInput(){
            var newhtml = ""
            selectedItems.map((item)=>{
                newhtml += `<div data-value="${item}" class="multiselect-option">
                ${item}
                <button data-value="${item}" class="btn multiselect-close" type='button'>
                    <i class="fas fa-times"></i>
                </button>
                </div>`
                const listItem = $(`${multiselectAttr} > .multiselect-list > [data-value=${item}]`)
                listItem.addClass("multiselect-list-active")
            })
            multiselectInput.html(newhtml)
            $(obj).val(selectedItems)
            console.log($(obj).val())
        }
        genHTMLInput()
        $(document).ready ( function () {
            $(document).on("click", ".multiselect-close", function (e) {
                
                const obj = $(this)
                const parent = obj.parent()
                selectedItems.splice(selectedItems.indexOf(parent.attr('data-value')), 1);
                const listItem = $(`${multiselectAttr} > .multiselect-list > [data-value=${parent.attr('data-value')}]`)
                listItem.removeClass("multiselect-list-active")
                genHTMLInput()
            });
        });
        
        $(`${multiselectAttr} > .multiselect-list > div`).click((e)=>{
            const obj = $(e.target)
            if (selectedItems.includes(obj.html())){
                selectedItems.splice(selectedItems.indexOf(obj.html()), 1);
                obj.removeClass("multiselect-list-active")
            } else {
                selectedItems.push(obj.html())
                obj.addClass("multiselect-list-active")
            }
            genHTMLInput()
        })
    });
}