const vlans_btn = document.querySelectorAll(".vlan_item_btn")

vlans_btn.forEach(el => {
    el.addEventListener("click", () => {
        const old = document.querySelector('[selected]')
        old.removeAttribute('selected')
        el.parentElement.setAttribute("selected", "")
    })
})

const header_btn = document.querySelectorAll(".header-nav-item")
header_btn.forEach(el => {
    el.addEventListener("click", ({target}) => {
        console.log(target)
        const { textContent } = target
        const pages = document.querySelectorAll('[page]')
        pages.forEach(page => {
            if(page.getAttribute('page') === "current") {
                page.hidden = true
                page.setAttribute('page', '')
            }
        })

        console.log(textContent)

        const new_page = document.getElementById(textContent.toLowerCase())
        new_page.hidden = false
        new_page.setAttribute('page', 'current')
    })
})

const save_btn = document.getElementById("save")
save_btn.addEventListener('click', () => {
    const modified = document.querySelectorAll('[unsaved]')
    console.log(modified)
    modified.forEach(item => {
        //console.log(item)
        item.removeAttribute('unsaved')
        item.setAttribute('saved', '')
    })
    
   
})

const refresh_btn = document.getElementById("refresh")
refresh_btn.addEventListener('click', () => {
    window.location.reload(true) 
})

const addevent = (inp) => {
    inp.forEach(item => {
        item.addEventListener('change', ({target}) => {
            const parent = target.closest(".htbl")
            parent.setAttribute('unsaved', '')
            parent.removeAttribute('saved')
        })
    })
}

const inputs = document.querySelectorAll('input')
const textsarea = document.querySelectorAll('textarea')
const select = document.querySelectorAll("select")

addevent(inputs)
addevent(textsarea)
addevent(select)





window.onbeforeunload = function(){
        if(document.querySelectorAll('[unsaved]').length !== 0) return 'Are you sure you want to leave?';
};