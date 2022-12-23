import { createInstructionData, InstructionData, withInsertTransaction, withSignOffProposal } from "@solana/spl-governance";
import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { usdToSolana } from "./tokenConversionUtils";
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token"

export const solTokenTrxn = async(
    connection: Connection,
    programId: any,
    safeAddress: string,
    programVersion: any,
    transactions: any, 
    nativeTreasury: any, 
    proposalInstructions: any, 
    governance: any, 
    proposalAddress: any,
    tokenOwnerRecord:any ,
    payer: any): Promise<any> => {

    console.log("realms creating sol token trxn")

    try{
        const safeAddressPublicKey = new PublicKey(safeAddress!);
        for(let i = 0; i < transactions.length; i++) {
            const solanaAmount = await usdToSolana(transactions[i].amount)
            console.log('solanaAmount', solanaAmount)
            const obj = {
                fromPubkey: nativeTreasury,
                toPubkey: new PublicKey(transactions[i].to),
                lamports: Math.floor(solanaAmount * 10**9),
                programId: programId,
            }
            console.log("realms obj", obj.fromPubkey.toString(), obj.toPubkey.toString(), obj.lamports)
            console.log("realms payer", payer.toString())
            const ins = SystemProgram.transfer(obj)
            const instructionData = createInstructionData(ins)
            await withInsertTransaction(
                proposalInstructions,
                programId,
                programVersion,
                governance.pubkey,
                proposalAddress,
                tokenOwnerRecord[0].pubkey,
                payer!,
                i,
                0,
                0,
                [instructionData],
                payer!
            )
        }

        withSignOffProposal(
            proposalInstructions,
            programId,
            programVersion,
            safeAddressPublicKey,
            governance.pubkey,
            proposalAddress,
            payer!,
            undefined,
            tokenOwnerRecord[0].pubkey
        )

        const getProvider = (): any => {
            if('solana' in window) {
                // @ts-ignore
                const provider = window.solana as any
                if(provider.isPhantom) {
                    return provider as any
                }
            }
        }

        const block = await connection.getLatestBlockhash('confirmed')
        const transaction = new Transaction()
        transaction.recentBlockhash = block.blockhash
        transaction.feePayer = payer!
        transaction.add(...proposalInstructions)
        console.log("realms transaction", transaction)
        await getProvider().signAndSendTransaction(transaction)
    } catch(e) {
        console.log('error', e)
    }
}

export const splTokenTrxn = async(
    connection: Connection,
    programId: PublicKey,
    safeAddress: string,
    programVersion: any,
    wallet: any,
    transactions: any, 
    nativeTreasury: any, 
    proposalInstructions: any, 
    governance: any, 
    proposalAddress: any,
    tokenOwnerRecord:any ,
    payer: any): Promise<any> => {

    try{
        const safeAddressPublicKey = new PublicKey(safeAddress!);
        const accountCreationInstruction: TransactionInstruction[] = []

        for(let i = 0; i < transactions.length; i++) {
            const mintPublicKey = new PublicKey(transactions[i]?.selectedToken.info.mint);  
            const mintToken = new Token(
                connection,
                mintPublicKey,
                TOKEN_PROGRAM_ID,
                wallet// the wallet owner will pay to transfer and to create recipients associated token account if it does not yet exist.
            );

            const [fromAddress] = await PublicKey.findProgramAddress(
                [nativeTreasury.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintPublicKey.toBuffer()],
                ASSOCIATED_TOKEN_PROGRAM_ID
            );
    
            const [toAddress] = await PublicKey.findProgramAddress(
                [new PublicKey(transactions[i].to).toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintPublicKey.toBuffer()],
                ASSOCIATED_TOKEN_PROGRAM_ID
            );

            const receiverAccount = await connection.getAccountInfo(toAddress);

            if (receiverAccount === null) {
                accountCreationInstruction.push(
                        Token.createAssociatedTokenAccountInstruction(
                            mintToken.associatedProgramId,
                            mintToken.programId,
                            mintPublicKey,
                            toAddress,
                            new PublicKey(transactions[i].to),
                            wallet.publicKey
                        )
                )
            }

            const instructions: InstructionData[] = []; 

            instructions.push(
                createInstructionData(
                    Token.createTransferInstruction(
                        TOKEN_PROGRAM_ID,
                        fromAddress,
                        toAddress,
                        nativeTreasury,
                        [],
                        transactions[i].amount*10**transactions[0]?.selectedToken.info.tokenAmount.decimals
                    )
                )
            );

            await withInsertTransaction(
                proposalInstructions,
                programId,
                programVersion,
                governance.pubkey,
                proposalAddress,
                tokenOwnerRecord[0].pubkey,
                payer!,
                i,
                0,
                0,
                instructions,
                payer!
            )
        }

        withSignOffProposal(
            proposalInstructions,
            programId,
            programVersion,
            safeAddressPublicKey,
            governance.pubkey,
            proposalAddress,
            payer!,
            undefined,
            tokenOwnerRecord[0].pubkey
        )

        const getProvider = (): any => {
            if('solana' in window) {
                // @ts-ignore
                const provider = window.solana as any
                if(provider.isPhantom) {
                    return provider as any
                }
            }
        }

        console.log('create New proposal - getProvider', getProvider())

        const block = await connection.getLatestBlockhash('confirmed')
        const transaction = new Transaction()
        transaction.recentBlockhash = block.blockhash
        transaction.feePayer = payer!
        if(accountCreationInstruction.length>0) {
            transaction.add(...accountCreationInstruction)
        }
        transaction.add(...proposalInstructions)
        await getProvider().signAndSendTransaction(transaction)
    } catch(e) {
        console.log('error', e)
    }
}