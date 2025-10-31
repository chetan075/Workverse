module 0x{{DEPLOYER}}::Escrow {
    use std::signer;
    use std::vector;
    use std::event;

    /// Simple resource to hold minted invoice ids for a user. This is a minimal example
    /// intended for local/dev testing. A production NFT should use the Token or Token2022
    /// standard and proper metadata handling.
    struct InvoiceCollection has key {
        invoices: vector<u64>,
        event_handle: event::EventHandle<u64>
    }

    public fun init_account(account: &signer) {
        if (!exists<InvoiceCollection>(signer::address_of(account))) {
            move_to(account, InvoiceCollection { invoices: vector::empty<u64>(), event_handle: event::new_event_handle<u64>(account) });
        }
    }

    public entry fun mint_invoice(account: &signer, invoice_id: u64) {
        // Ensure collection exists
        if (!exists<InvoiceCollection>(signer::address_of(account))) {
            init_account(account);
        }
        let addr = signer::address_of(account);
        let coll_ref = borrow_global_mut<InvoiceCollection>(addr);
        vector::push_back(&mut coll_ref.invoices, invoice_id);
        // emit event with invoice id
        event::emit_event(&mut coll_ref.event_handle, invoice_id);
    }

    // Reputation SBT example: store a simple reputation score under user's account
    struct Reputation has key {
        score: u64
    }

    public entry fun mint_reputation(account: &signer, score: u64) {
        if (!exists<Reputation>(signer::address_of(account))) {
            move_to(account, Reputation { score });
        } else {
            let r = borrow_global_mut<Reputation>(signer::address_of(account));
            r.score = r.score + score;
        }
    }
}
