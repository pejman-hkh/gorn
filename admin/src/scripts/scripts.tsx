NodeList = window.NodeList;

NodeList.prototype.each = function (callback) {
    this.forEach(function (elm, index) {
        callback.call(elm, elm, index);
    });
    return this;
};

["focusin", "focusout", "load", "beforeunload", "unload", "change", "click", "dblclick", "focus", "blur", "reset", "submit", "resize", "scroll", "mouseover", "mouseout", "mouseup", "mousedown", "mouseenter", "mousemove", "mouseleave", "contextmenu", "wheel", "keydown", "keypress", "keyup", "select"].forEach(function (name, index) {

    NodeList.prototype[name] = function (callback) {
        this.each(function (elm, index) {
            this.addEventListener(name, callback);
        });
        return this;
    }

});

function DarkMode() {

    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    if (themeToggleDarkIcon == null) return

    // Change the icons inside the button based on previous settings
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        themeToggleLightIcon.classList.remove('hidden');
    } else {
        themeToggleDarkIcon.classList.remove('hidden');
    }

    const themeToggleBtn = document.getElementById('theme-toggle');

    let event = new Event('dark-mode');

    themeToggleBtn.addEventListener('click', function () {

        // toggle icons
        themeToggleDarkIcon.classList.toggle('hidden');
        themeToggleLightIcon.classList.toggle('hidden');

        // if set via local storage previously
        if (localStorage.getItem('color-theme')) {
            if (localStorage.getItem('color-theme') === 'light') {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            }

            // if NOT set via local storage previously
        } else {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            }
        }

        document.dispatchEvent(event);

    });
}

function SideBar() {

    const sidebar = document.getElementById('sidebar');

    if (sidebar) {

        const toggleSidebarMobile = (sidebar, sidebarBackdrop, toggleSidebarMobileHamburger, toggleSidebarMobileClose) => {
            sidebar.classList.toggle('hidden');
            sidebarBackdrop.classList.toggle('hidden');
            toggleSidebarMobileHamburger.classList.toggle('hidden');
            toggleSidebarMobileClose.classList.toggle('hidden');
        }

        const toggleSidebarMobileEl = document.getElementById('toggleSidebarMobile');
        const sidebarBackdrop = document.getElementById('sidebarBackdrop');
        const toggleSidebarMobileHamburger = document.getElementById('toggleSidebarMobileHamburger');
        const toggleSidebarMobileClose = document.getElementById('toggleSidebarMobileClose');
        const toggleSidebarMobileSearch = document.getElementById('toggleSidebarMobileSearch');

        toggleSidebarMobileSearch.addEventListener('click', () => {
            toggleSidebarMobile(sidebar, sidebarBackdrop, toggleSidebarMobileHamburger, toggleSidebarMobileClose);
        });

        toggleSidebarMobileEl.addEventListener('click', () => {

            toggleSidebarMobile(sidebar, sidebarBackdrop, toggleSidebarMobileHamburger, toggleSidebarMobileClose);
        });

        sidebarBackdrop.addEventListener('click', () => {
            toggleSidebarMobile(sidebar, sidebarBackdrop, toggleSidebarMobileHamburger, toggleSidebarMobileClose);
        });
    }
}

export default function MainScript() {
    document.querySelectorAll("[data-dropdown-toggle]").click(function (e) {
        let ddb = document.getElementById(this.getAttribute('data-dropdown-toggle'))
        ddb.classList.toggle('hidden')
        ddb.style.position = 'absolute'
        ddb.style.right =  (window.innerWidth -this.getBoundingClientRect().right - 20 )+'px'
        ddb.style.top = ((this?.offsetTop) + this.clientHeight + 5 ) + 'px'

    })

    document.addEventListener('click', function(e) {
        let element = e.target
        while(element.parentNode) {
            if( element.hasAttribute('data-dropdown-toggle') ) {
                return
            }

            element = element.parentNode;
        }

        if( e.target.hasAttribute('data-dropdown-toggle') )
            return

        document.querySelectorAll("[data-dropdown-toggle]").each(function() {
            let ddb = document.getElementById(this.getAttribute('data-dropdown-toggle'))
            ddb.classList.add('hidden')
        })
    })

    document.querySelectorAll("[modal]").click(function (e) {
        if( ! e.target.hasAttribute('modal'))
            return

        this.previousSibling.classList.toggle('hidden')
        this.classList.toggle('hidden')
    })


    document.querySelectorAll("[data-modal-target],[data-modal-toggle]").click(function (e) {
        let ddb = document.getElementById(this.getAttribute('data-modal-target') || this.getAttribute('data-modal-toggle'))
        ddb.classList.toggle('hidden')
        ddb.previousSibling.classList.toggle('hidden')
    })


    DarkMode()
    SideBar();
}