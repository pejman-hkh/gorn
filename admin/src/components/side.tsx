import { useTranslation } from "react-i18next"
import Link from "../router/link"

import * as Svg from "./svg"
import { resources } from "../i18n"
import { useContext, useRef } from "react"
import { DataContext } from "../router/data"

function MenuItem({ children, ...props }: any) {
    return <li {...props}>{children}</li>
}
function MenuSvg({ children, ...props }: any) {
    return <svg {...props}
        className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
        fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        {children}
    </svg>
}

function MenuText({ children, ...props }: any) {
    return <span {...props} className="ltr:ml-3 rtl:mr-3" sidebar-toggle-item="true">{children}</span>
}
function MenuLink({ children, ...props }: any) {
    return <Link {...props} to={props.to}
        className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700">
        {children}
    </Link>
}
function MenuSearch({ }) {
    return <form action="#" method="GET" className="lg:hidden">
        <label htmlFor="mobile-search" className="sr-only">Search</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"></path>
                </svg>
            </div>
            <input type="text" name="email" id="mobile-search"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Search" />
        </div>
    </form>
}

function MenuButton({ children, ...props }: any) {
    const handler = (e: any) => {
        // e.target.parentElement.nextSibling.classList.toggle('hidden')
    }

    return <button onClick={handler} type="button"
        className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
        aria-controls="dropdown-layouts" {...props}>
        {children}
    </button>
}

function MenuButtonText({ children }: any) {
    return <span className="flex-1 ltr:ml-3 rtl:mr-3 ltr:text-left rtl:text-right whitespace-nowrap" sidebar-toggle-item="true">{children}</span>
}

function IconDown() {
    return <svg sidebar-toggle-item="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"></path>
    </svg>
}

function MenuChilds({ children, ...props }: any) {
    return <ul {...props} className="hidden py-2 space-y-2">{children}</ul>
}

function LangItem({ children, ...props }: any) {
    const { i18n } = useTranslation()
    const dataContext = useContext(DataContext) as Array<any>
    const setDirection = dataContext[4][1]
    const res: any = resources

    const handler = () => {
        i18n.changeLanguage(props.lang)

        localStorage.setItem('lang', props.lang)
        setDirection(res[props.lang]?.direction)
    }

    return <li {...props}>
        <a onClick={handler} href="#"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
            role="menuitem">
            <div className="inline-flex items-center">
                {children}
            </div>
        </a>
    </li>

}

export default function Side() {
    const { t, i18n } = useTranslation();
    let Icon: any

    if (i18n.language == 'fa') {
        Icon = Svg.Iran
    } else {
        Icon = Svg.Usa
    }

    const langBtn = useRef<any>(null)
    return <aside id="sidebar"
        className="fixed top-0 ltr:left-0 rtl:right-0 z-20 flex flex-col flex-shrink-0 hidden w-64 h-full pt-16 font-normal duration-75 lg:flex transition-width"
        aria-label="Sidebar">
        <div
            className="relative flex flex-col flex-1 min-h-0 pt-0 bg-white ltr:border-r rtl:border-l border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
                <div className="flex-1 px-3 space-y-1 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    <ul className="pb-2 space-y-2">
                        <MenuItem>
                            <MenuSearch></MenuSearch>
                        </MenuItem>

                        <MenuItem>
                            <MenuLink to="/dashboard">
                                <MenuSvg>
                                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                                </MenuSvg>
                                <MenuText>{t("Dashboard")}</MenuText>
                            </MenuLink>
                        </MenuItem>

                        <MenuItem>
                            <MenuButton data-collapse-toggle="dropdown-users">
                                <MenuSvg>
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />

                                </MenuSvg>
                                <MenuButtonText>{t("User")}</MenuButtonText>
                                <IconDown />
                            </MenuButton>
                            <MenuChilds id="dropdown-users">
                                <MenuItem><MenuLink to="/users">{t("User")}</MenuLink></MenuItem>
                                <MenuItem><MenuLink to="/groups">{t("Group")}</MenuLink></MenuItem>
                            </MenuChilds>

                        </MenuItem>


                        <MenuItem>
                            <MenuLink to="/menus">
                                <MenuSvg>
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 6h8M6 10h12M8 14h8M6 18h12"></path>
                                </MenuSvg>
                                <MenuText>{t("Menu")}</MenuText>
                            </MenuLink>
                        </MenuItem>

                        <MenuItem>
                            <MenuLink to="/pages">

                                <svg className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z" clipRule="evenodd" />
                                </svg>


                                <MenuText>{t("Page")}</MenuText>
                            </MenuLink>
                        </MenuItem>

                        <MenuItem>
                            <MenuLink to="/posts">

                                <svg className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M8 7V2.221a2 2 0 0 0-.5.365L3.586 6.5a2 2 0 0 0-.365.5H8Zm2 0V2h7a2 2 0 0 1 2 2v.126a5.087 5.087 0 0 0-4.74 1.368v.001l-6.642 6.642a3 3 0 0 0-.82 1.532l-.74 3.692a3 3 0 0 0 3.53 3.53l3.694-.738a3 3 0 0 0 1.532-.82L19 15.149V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Z" clipRule="evenodd" />
                                    <path fillRule="evenodd" d="M17.447 8.08a1.087 1.087 0 0 1 1.187.238l.002.001a1.088 1.088 0 0 1 0 1.539l-.377.377-1.54-1.542.373-.374.002-.001c.1-.102.22-.182.353-.237Zm-2.143 2.027-4.644 4.644-.385 1.924 1.925-.385 4.644-4.642-1.54-1.54Zm2.56-4.11a3.087 3.087 0 0 0-2.187.909l-6.645 6.645a1 1 0 0 0-.274.51l-.739 3.693a1 1 0 0 0 1.177 1.176l3.693-.738a1 1 0 0 0 .51-.274l6.65-6.646a3.088 3.088 0 0 0-2.185-5.275Z" clipRule="evenodd" />
                                </svg>



                                <MenuText>{t("Post")}</MenuText>
                            </MenuLink>
                        </MenuItem>


                        <MenuItem>
                            <MenuLink to="/medias">
                                <svg className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z" />
                                </svg>
                                <MenuText>{t("Media")}</MenuText>
                            </MenuLink>
                        </MenuItem>

                        <MenuItem>
                            <MenuLink to="/messages">
                                <svg className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.556 8.5h8m-8 3.5H12m7.111-7H4.89a.896.896 0 0 0-.629.256.868.868 0 0 0-.26.619v9.25c0 .232.094.455.26.619A.896.896 0 0 0 4.89 16H9l3 4 3-4h4.111a.896.896 0 0 0 .629-.256.868.868 0 0 0 .26-.619v-9.25a.868.868 0 0 0-.26-.619.896.896 0 0 0-.63-.256Z" />
                                </svg>

                                <MenuText>{t("Message")}</MenuText>
                            </MenuLink>
                        </MenuItem>

                        <MenuItem>
                            <MenuLink to="/comments">
                                <svg className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-6.616l-2.88 2.592C8.537 20.461 7 19.776 7 18.477V17H5a2 2 0 0 1-2-2V6Zm4 2a1 1 0 0 0 0 2h5a1 1 0 1 0 0-2H7Zm8 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2Zm-8 3a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H7Zm5 0a1 1 0 1 0 0 2h5a1 1 0 1 0 0-2h-5Z" clipRule="evenodd" />
                                </svg>

                                <MenuText>{t("Comment")}</MenuText>
                            </MenuLink>
                        </MenuItem>

                        <MenuItem>
                            <MenuLink to="/settings">
                                <MenuSvg>
                                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />

                                </MenuSvg>
                                <MenuText>{t("Setting")}</MenuText>
                            </MenuLink>
                        </MenuItem>

                        <MenuItem>
                            <MenuButton data-collapse-toggle="dropdown-shop">
                                <svg className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M14 7h-4v3a1 1 0 0 1-2 0V7H6a1 1 0 0 0-.997.923l-.917 11.924A2 2 0 0 0 6.08 22h11.84a2 2 0 0 0 1.994-2.153l-.917-11.924A1 1 0 0 0 18 7h-2v3a1 1 0 1 1-2 0V7Zm-2-3a2 2 0 0 0-2 2v1H8V6a4 4 0 0 1 8 0v1h-2V6a2 2 0 0 0-2-2Z" clipRule="evenodd" />
                                </svg>

                                <MenuButtonText>{t("Shop")}</MenuButtonText>
                                <IconDown />
                            </MenuButton>
                            <MenuChilds id="dropdown-shop">
                                <MenuItem><MenuLink to="/shop/variants">{t("Variant")}</MenuLink></MenuItem>
                                <MenuItem><MenuLink to="/shop/prices">{t("Price")}</MenuLink></MenuItem>
                                <MenuItem><MenuLink to="/shop/categories">{t("Category")}</MenuLink></MenuItem>
                                <MenuItem><MenuLink to="/shop/products">{t("Product")}</MenuLink></MenuItem>
                                <MenuItem><MenuLink to="/shop/params">{t("Parameter")}</MenuLink></MenuItem>
                                <MenuItem><MenuLink to="/shop/galleries">{t("Gallery")}</MenuLink></MenuItem>
                                <MenuItem><MenuLink to="/shop/brands">{t("Brand")}</MenuLink></MenuItem>
                                <MenuItem><MenuLink to="/shop/warranties">{t("Warranty")}</MenuLink></MenuItem>
                                <MenuItem><MenuLink to="/shop/settings">{t("Setting")}</MenuLink></MenuItem>
                            </MenuChilds>

                        </MenuItem>

                    </ul>

                </div>
            </div>
            <div
                className="absolute bottom-0 left-0 justify-center hidden w-full p-4 space-x-4 bg-white lg:flex dark:bg-gray-800"
                sidebar-bottom-menu="true">
                <a href="#"
                    className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z">
                        </path>
                    </svg>
                </a>
                <Link to="/settings" data-tooltip-target="tooltip-settings"
                    className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd"
                            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                            clipRule="evenodd"></path>
                    </svg>
                </Link>
                <div id="tooltip-settings" role="tooltip"
                    className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                    {t("Settings page")}
                    <div className="tooltip-arrow" data-popper-arrow></div>
                </div>
                <button type="button" ref={langBtn} data-dropdown-toggle="language-dropdown"
                    className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                    <Icon className="h-5 w-5 rounded-full mt-0.5" />

                </button>

                <div
                    className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700"
                    id="language-dropdown">
                    <ul className="py-1" role="none">
                        <LangItem lang="en" langbtn={langBtn}>
                            <Svg.Usa />
                            English (US)
                        </LangItem>

                        <LangItem lang="fa" langbtn={langBtn}>
                            <Svg.Iran />
                            Iran (IR)
                        </LangItem>
                    </ul>
                </div>
            </div>
        </div>
    </aside>
}