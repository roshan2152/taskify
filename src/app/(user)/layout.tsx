import Sidebar from "@/components/sidebar/sidebar"

const userLayout = ({children} : Readonly<{
    children:React.ReactNode
}>) => {
    return (
        <>
            <Sidebar/>
            <div className="h-full w-full">
                {children}
            </div>
        </>
    )
}

export default userLayout