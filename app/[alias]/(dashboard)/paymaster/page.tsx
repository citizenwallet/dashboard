import PaymasterTable from "./paymaster-table";

export default function page() {
    return (
        <div className="flex flex-1 w-full flex-col h-full">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">Paymaster</h1>
                    <p className="text-sm text-gray-500"> update paymaster </p>
                </div>

            </div>
            <PaymasterTable />
        </div>
    )
}
