module 0x{{DEPLOYER}}::Escrow {
    use std::signer;
    use std::vector;
    use std::event;
    use std::string;
    use std::option;

    // Minimal Token2022-like implementation for invoices + SBT metadata (development)
    // This is NOT a fully audited Token2022 module, but provides the shape and metadata
    // storage so the backend can mint tokens with metadata attached for testing.

    struct Token has key {
        id: u64,
        uri: vector<u8>,
    }

    struct TokenStore has key {
        tokens: vector<Token>,
        event_handle: event::EventHandle<u64>,
    }

    public fun init_account(account: &signer) {
        let addr = signer::address_of(account);
        if (!exists<TokenStore>(addr)) {
            move_to(account, TokenStore { tokens: vector::empty<Token>(), event_handle: event::new_event_handle<u64>(account) });
        }
    }

    public entry fun mint_invoice_with_metadata(account: &signer, invoice_id: u64, metadata: vector<u8>) {
        let addr = signer::address_of(account);
        if (!exists<TokenStore>(addr)) {
            init_account(account);
        }
        let store = borrow_global_mut<TokenStore>(addr);
        let token = Token { id: invoice_id, uri: metadata };
        vector::push_back(&mut store.tokens, token);
        event::emit_event(&mut store.event_handle, invoice_id);
    }

    // Reputation SBT: store a simple reputation score as an optional value in account storage
    struct Reputation has key {
        score: u64
    }

    public entry fun mint_reputation(account: &signer, score: u64) {
        let addr = signer::address_of(account);
        if (!exists<Reputation>(addr)) {
            move_to(account, Reputation { score });
        } else {
            let r = borrow_global_mut<Reputation>(addr);
            r.score = r.score + score;
        }
    }
}
