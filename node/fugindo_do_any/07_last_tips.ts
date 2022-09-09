const return_unknown = (): unknown => {
    return 'Unknown aceita qualquer tipo exceto pelo `any`'
}

const return_never = (): never => {
    throw new Error('Never nunca retorna um valor');
}

const unknown_test = return_unknown()
console.log(unknown_test)
return_never()