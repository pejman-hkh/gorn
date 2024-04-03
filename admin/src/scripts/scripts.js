export default function MainScript() {
    document.querySelectorAll("[data-dropdown-toggle]").on('click.dropdown.toggle',function (e) {
        let ddb = document.getElementById(this.getAttribute('data-dropdown-toggle'))
        ddb.classList.toggle('hidden')
        ddb.style.position = 'absolute'
        ddb.style.right =  (window.innerWidth -this.getBoundingClientRect().right - 20 )+'px'
        ddb.style.top = ((this?.offsetTop) + this.clientHeight + 5 ) + 'px'

    })

    document.querySelectorAll("[modal]").on('click.modal.hide', function (e) {
        if( ! e.target.hasAttribute('modal'))
            return

        this.previousSibling.classList.toggle('hidden')
        this.classList.toggle('hidden')
    })


    document.querySelectorAll("[data-modal-target],[data-modal-toggle]").on('click.modal.open', function (e) {
        let ddb = document.getElementById(this.getAttribute('data-modal-target') || this.getAttribute('data-modal-toggle'))
        ddb.classList.toggle('hidden')
        ddb.previousSibling.classList.toggle('hidden')
    })
}