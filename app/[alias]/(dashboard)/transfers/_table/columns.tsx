

interface Transfer {
    hash: string;
    from: {
        username: string;
        address: string;
    };
    to: {
        username: string;
        address: string;
    };
    amount: string;
    description: string | null;
    status: string;
    createdAt: Date;
}