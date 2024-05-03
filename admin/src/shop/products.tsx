import Pagination from "../components/pagination"
import * as List from "../components/list"
import * as Grid from "../components/grid"
import Form, { Input, Select, Editor, SelectSearch, Label } from "../components/form"
import { useContext, useEffect, useRef, useState } from "react"
import { DataContext } from "../router/data"
import Link from "../router/link"
import DateTime from "../components/date"
import { useTranslation } from 'react-i18next';
import * as BreadCrumb from "../components/breadcrumb"
import Api from "../router/api"

import CreatableSelect from 'react-select/creatable';
import * as Modal from "../components/modal"
import Button from "../components/button"

export function SearchForm() {
    return <MainForm noeditor="true" />
}

const PriceForm = ({ ...props }) => {
    const edit = props?.edit

    const { t } = useTranslation();
    const [variants, setVariants] = useState<any>([])
    const [prices, setPrices] = useState<any>([])
    const [check, setCheck] = useState(0)

    useEffect(() => {
        const category = edit?.category
        console.log(category)
        Api("admin/shop/categories?nopage=true&id=" + encodeURIComponent(category?.id)).then((data: any) => {
            let list: any[] = []
            data?.data?.list[0]?.variants.map((item: any) => {
                list.push(item)
            })
            setVariants(list)
        })

        Api("admin/shop/products?nopage=true&id=" + encodeURIComponent(edit?.id)).then((data: any) => {
            let list: any[] = []
            data?.data?.list[0]?.prices.map((item: any) => {
                list.push(item)
            })
            setPrices(list)
        })
    }, [edit?.id, check])

    const [action, setAction] = useState("")
    useEffect(() => {
        deleteForm?.current.requestSubmit()
    }, [action])
    const deleteForm = useRef<any>(null)

    return <>
        <Form fref={deleteForm} key={Math.random()} method="delete" action={action} success={() => { setCheck(check + 1) }}>
        </Form>
        <Form key={edit?.id} method="post" action={"shop/prices/create"} alertclass="" success={() => { setCheck(check + 1) }}>
            <input type="hidden" name="product_id" defaultValue={edit?.id} />
            <Grid.Wrapper key={edit?.id}>
                <Grid.Span6>
                    <Input type="text" name="title">{t("Title")}</Input>
                </Grid.Span6>

                {variants.map((item: any) => {
                    return <Grid.Col6>
                        <input type="hidden" name="variant_id[]" value={item.id} />
                        <Input type="text" name="variant[]">{item.title}</Input>
                    </Grid.Col6>
                })}

                <Grid.Span6>
                    <Input type="text" name="price">{t("Price")}</Input>
                </Grid.Span6>
                <Grid.Col6>
                    <Label>&nbsp;</Label>
                    <Button type="submit">{t("Add Price")}</Button>
                </Grid.Col6>
            </Grid.Wrapper>
        </Form>

        <Grid.Span6>
            <List.Table>
                <List.Tbody>

                    {prices.map((item: any) => {
                        return <List.Tr>
                            <List.Td>
                                {item.title}
                            </List.Td>
                            <List.Td width="10%">
                                <List.ButtonDelete onClick={() => { setAction('/shop/prices/' + item?.id) }}></List.ButtonDelete>
                            </List.Td>
                        </List.Tr>
                    })}
                </List.Tbody>
            </List.Table>
        </Grid.Span6>
    </>
}

function ButtonPrice({ children, ...props }: any) {

    const { t } = useTranslation()
    const id = Math.random()
    return <><button data-tooltip-target={id} {...props} onClick={props?.onClick} type="button" className="rtl:ml-1 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
        <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2" />
        </svg>

        {children}</button>
        <List.Tooltip id={id}>{t("Prices")}</List.Tooltip>
    </>
}

function paramsToQuestionIdIndex(params: any) {
    let ret: any = {}
    for (const x in params) {
        const v = params[x]
        ret[v.question_id] = v
    }
    return ret
}

export function MainForm({ ...props }) {
    let edit = props.edit
    const { t } = useTranslation();
    const [categories, setCategories] = useState<any>([])
    const params = paramsToQuestionIdIndex(edit?.params)

    const toOption = (options: any) => {
        let ret: any = []
        for (const x in options) {
            let v = options[x]
            ret.push({ label: v.title, value: v.title })
        }
        return ret
    }

    return <Grid.Wrapper key={edit?.id} {...props}>

        <Grid.Span6>
            <SelectSearch onChange={(item: any) => {
                if (!item?.value) return
                Api("admin/shop/categories/param?nopage=true&id=" + encodeURIComponent(item?.value)).then((data: any) => {
                    let list: any[] = []
                    data?.data?.categories.map((item: any) => {
                        list.push(item)
                    })
                    setCategories(list)
                })
            }} default={true} title={t("Category")} path={"/admin/shop/categories"} name="category_id" edit={edit} defaultValue={edit?.category_id}>
                <option value="">{t("Select")}</option>
            </SelectSearch>
        </Grid.Span6>

        <Grid.Col6>
            <Input type="text" name="title" defaultValue={edit?.title}>{t("Title")}</Input>
        </Grid.Col6>

        <Grid.Col6>
            <Input type="text" name="url" defaultValue={edit?.url}>{t("Url")}</Input>
        </Grid.Col6>

        <Grid.Col6>
            <Input type="text" name="stock" defaultValue={edit?.stock}>{t("Stock")}</Input>
        </Grid.Col6>


        <Grid.Col6>
            <Select name="status" title={t("Status")} defaultValue={edit?.status}>
                <option value="1">{t("Enable")}</option>
                <option value="0">{t("Disable")}</option>
            </Select>
        </Grid.Col6>

        <Grid.Col6>
            <Select name="comment_allow" title={t("Has Comment")} defaultValue={edit?.comment_allow}>
                <option value="true">{t("Has")}</option>
                <option value="false">{t("Doesn't have")}</option>
            </Select>
        </Grid.Col6>

        <Grid.Span6>
            <Editor noeditor={props?.noeditor || false} name="short_content" title={t("Short Content")} defaultValue={edit?.short_content || ""} />
        </Grid.Span6>

        <Grid.Span6>
            <Editor noeditor={props?.noeditor || false} name="content" title={t("Content")} defaultValue={edit?.content || ""} />
        </Grid.Span6>

        <Grid.Span6>
            {categories?.map((category: any) => {
                return <Grid.Wrapper key={'category-' + category.id} className="border-t border-gray-200 p-5">
                    <Grid.Span6> <h1 className="mt-2 text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">{category.title}</h1></Grid.Span6>
                    {category.questions.map((question: any) => {
                        return <Grid.Col6 key={'question-' + question.id}>
                            {/*<Input type="text" name={"question['" + question?.id + "']"} defaultValue={params[question?.id]?.answer?.title}>{question.title}</Input>*/}

                            {/* <SelectSearch isClearable={true} default={true} title={question.title} name={"question['" + question?.id + "']"} edit={edit} defaultValue={params[question?.id]?.answer?.title}>
                                <option value="">{t("Select")}</option>
                                {question?.answers.map((answer:any) => <option key={'answer-'+answer.id} value={answer.id}>{answer.title}</option>)}
                            </SelectSearch> */}
                            <Label>{question.title}</Label>
                            <CreatableSelect name={"question['" + question?.id + "']"} styles={{ control: (styles) => ({ ...styles, borderColor: "#D1D5DB", backgroundColor: "#F9FAFB" }) }} isClearable options={toOption(question?.answers)} defaultValue={{ value: params[question?.id]?.answer?.title, label: params[question?.id]?.answer?.title }} />
                        </Grid.Col6>
                    })}
                </Grid.Wrapper>
            })}
        </Grid.Span6>
    </Grid.Wrapper>
}

export function Index() {

    const route = "/shop/products"
    const title = "Product"

    const dataContext = useContext(DataContext) as any
    const data = dataContext.data[0]

    const [edit, setEdit] = useState<any>({})
    const editModal = useState(false)
    const searchModal = useState(false)
    const addModal = useState(false)
    const deleteModal = useState(false)
    const mediaModal = useState(false)
    const deleteAllModal = useState(false)
    const priceModal = useState(false)
    const [actionValue, setActionValue] = useState("")

    const editHandler = (e: any, item: any) => {
        e.preventDefault()
        editModal[1](true)
        setEdit(item)
    }

    const listForm = useRef<any>(null)

    const { t } = useTranslation();
    const ModuleBreadcrumb = <BreadCrumb.Item to="/shop/dashboard">{t("Shop")}</BreadCrumb.Item>

    const category = useState<any>({})

    const method = "json"
    return <>
        <List.BreadCrumb {...{ ModuleBreadcrumb, title, route, setActionValue, deleteAllModal, addModal, setEdit, searchModal }}></List.BreadCrumb>

        <Form fref={listForm} disableclass="true" method="post" action={route + "/actions"} alertclass="m-6">
            <input type="hidden" name="action" value={actionValue} />

            <List.Table>
                <List.Thead>
                    <tr>
                        <List.Th>
                            <List.Checkbox />
                        </List.Th>
                        <List.Th width="20%">{t("Title")}</List.Th>
                        <List.Th>{t("User")}</List.Th>
                        <List.Th>{t("Type")}</List.Th>
                        <List.Th>{t("Attachments")}</List.Th>
                        <List.Th>{t("Url")}</List.Th>
                        <List.Th>{t("Status")}</List.Th>
                        <List.Th>{t("Date")}</List.Th>
                        <List.Th width="5%">{t("Actions")}</List.Th>
                    </tr>
                </List.Thead>
                <List.Tbody>
                    {data?.data?.list?.map((item: any) => (
                        <List.Tr key={item.id}>
                            <List.TdCheckbox>
                                <List.CheckboxTd name="ids[]" value={item.id} />
                            </List.TdCheckbox>

                            <List.TdTitle>
                                {item.title}
                            </List.TdTitle>


                            <List.Td><Link to={"/users?id=" + item?.user?.id}>{item?.user?.name}</Link></List.Td>
                            <List.Td><Link to={"/post/types?id=" + item?.type?.id}>{item?.type?.title}</Link></List.Td>
                            <List.Td><Link to={"/medias?module=" + encodeURIComponent(route.substr(1)) + "&item_id=" + item?.id}>{t("Attachments")}</Link></List.Td>

                            <List.TdText>
                                {item.url}
                            </List.TdText>


                            <List.Td>
                                <List.ActiveBadge active={item?.status} />
                            </List.Td>
                            <List.Td>
                                <DateTime time={item.created_at} />
                                <br />
                                {item.updated_at != item.created_at ? <DateTime time={item.updated_at} /> : ""}
                            </List.Td>
                            <List.TdAction>
                                <ButtonPrice onClick={() => { priceModal[1](true); setEdit(item) }}></ButtonPrice>
                                <List.ButtonFile onClick={() => { mediaModal[1](true); setEdit(item) }}></List.ButtonFile>
                                <List.ButtonEdit onClick={(e: any) => editHandler(e, item)}></List.ButtonEdit>
                                <List.ButtonDelete onClick={() => { deleteModal[1](true); setEdit(item) }}></List.ButtonDelete>

                            </List.TdAction>
                        </List.Tr>
                    ))}

                </List.Tbody>
            </List.Table>
        </Form>
        <Pagination pagination={data?.data?.pagination} module={route}></Pagination>

        <List.Modals {...{ method, mediaModal, SearchForm, title, route, edit, MainForm, addModal, editModal, searchModal, deleteModal, deleteAllModal, listForm }}></List.Modals >

        <Modal.Modal title={t("Add Price")} show={priceModal} size="max-w-2xl" zindex="z-50">
            <Modal.Content>
                <PriceForm {...{ edit }} />
            </Modal.Content>
        </Modal.Modal>

    </>
}