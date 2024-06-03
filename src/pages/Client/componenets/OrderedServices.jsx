import { useTransactionContext } from "@/context/transactionContext";

export const OrderedServices = () => {
  const { transaction } = useTransactionContext();

  return (
    <div className="text-black size-full grid gap-10">
      <h1 className="text-3xl font-semibold">Ordered Services</h1>

      <div className="grid grid-cols-3 gap-5">
        {transaction ? (
          transaction.map((transaction) => (
            <div
              className="grid col-span-1 relative rounded-sm shadow-xl"
              key={transaction._id}
            >
              <img
                src={`/ServiceImages/${transaction.service.image}`}
                className="object-cover rounded-lg"
              />
              <div className="absolute text-center flex items-center justify-center text-white inset-0 bg-overlay">
                <h1 className="text-xl">
                  {transaction.quantity} x {transaction.service.name}
                </h1>
              </div>
              <div></div>
            </div>
          ))
        ) : (
          <div>No services found</div>
        )}
      </div>
    </div>
  );
};
