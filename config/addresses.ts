export interface AbstractDeployment {
  IDEA?: string
  MEMORY: string
  MODULE_FACTORY: string
  VERSION_CONTROL: string
  OS_FACTORY: string

  // optional modules
  DEX: string
  TENDERMINT_STAKING: string

  // Internal
  _PROXY?: string
  _MANAGER?: string
  _SUBSCRIPTION?: string
  _VALIDATOR?: string
}

export const ABSTRACT_DEPLOYMENTS: Record<string, AbstractDeployment> = {
  'uni-5': {
    // _MANAGER: 'juno1vrp3vjqjekz3ys333usf28kp55c0luyfpksv0y0vakzswsvzz9yq5a5uxq',
    // _PROXY: 'juno1az5ws6vd8m78kqpmapr8kasma5nvxrxemu58wycetxmske99autq29qw5x',
    // _SUBSCRIPTION: 'juno13kh3ryfrur2c0wyyaca9cdlez38wflpcfh33zdnh3t0ud2ryan6snmvupe',
    // DEX: 'juno1faz9ypvdlc0xvtnmkenhl93atx3j4jk7p0ftatxn9avr93nffcgsc80gs9',
    // IDEA: 'juno1yqgnk7fw5d2aafew4t4z5pw4ew8z4sgw8tnk5exjpw0pt0txfnhsxajpha',
    // MEMORY: 'juno13rn3zanze3ngv6hdd8jtx89w57dgrcmmq3ms4wjym8gnkv2ll6pqtafh9g',
    // MODULE_FACTORY: 'juno1r3ha2lxj0pgvxuacja5hmxdsetu6qeakav3a9msh466xdtkkpnnqqhlffn',
    // OS_FACTORY: 'juno1r553zaexcjc6sxs3vp7z0szcjr7l7rph3mzg0r79x08hsp7lap7qfn3c34',
    // TENDERMINT_STAKING: 'juno146c55yjsrk280n6a0rhxvqme5hey5njvvz3ffs82w5aekjtchxaqxtnwfs',
    // VERSION_CONTROL: 'juno1443w9akrzt7vj4a9mxwn20vqvl47n9jsnua4254kq08kxkcxsarqu5pzw2',
    DEX: 'juno1kp4g9y2cvx2gkyk6lhqe5258jpg5w5x8vv38qrtth9lu8h7mpmeqjnlulu',
    MEMORY: 'juno18sxsx4zlmz2q7d2e6wh462rf4789my22veeejca40tdkz5spa0fsu0s7vl',
    MODULE_FACTORY:
      'juno109uzd3lsnuz3z3h353jg96nc88dfeyw7xx3xc3njjugqlwg80ngs2hhjnt',
    OS_FACTORY:
      'juno127f4jyjy7v598302crvcp4jx684xjhhdgm5k9vnaxcvmaw6xqpqq75t3qs',
    TENDERMINT_STAKING:
      'juno1x5kpv6n5wgd3yw6gq8vly7y599xuxaq66x7xr887rnkzgz5r0jwq5yt9tn',
    VERSION_CONTROL:
      'juno1wfzydxjmtynrqgar83a92l56kphfadrvsrzl3du33vg25uphf7lse8smen',
  },
  'juno-1': {
    _MANAGER: 'juno1gzexf6tnrx5yr9k9nfjtn8e87a7ty44mgn85t0vr8qklgah43g0qdjp4a0',
    _PROXY: 'juno1xc7vy3emay03v8l5j4z2fy7hsq0kr92e2rq2pc54e4zz3zjw6hwqnurnct',
    _SUBSCRIPTION:
      'juno1afuwke6dq62t4km2t80kt36ep5gnza5xtgkfzzzzq2k0h6zz258qpxtw76',
    _VALIDATOR: 'junovaloper15mlr3tp7le827h7x597rcl4ykyc3vufgd55t9c',
    DEX: 'juno15d0jcacyvlf4ueaq8n8q8hkenkgrmx2rvtu3nula6rza3yr43g3szna7jw',
    IDEA: 'juno1hu9hvzkxhmv2qgpg3n44lz3w88t4c7ukn2f3rwm64kpf8x6mp48qwcnl55',
    MEMORY: 'juno1t799uvztv2cqngk2w47zd6g20d62fcgznjftyu3f7vxdc2pnq39q88a9uh',
    MODULE_FACTORY:
      'juno13hqga309sp2e3ffhqkk5s4py8h9zf42kl0srgxcxqyv8y6azqmgs3c5dwh',
    OS_FACTORY:
      'juno1qfx94jjjuagkx0n8yc9q69035nnjck6t579mnacgy2tfkwr30r2s6q5qmt',
    TENDERMINT_STAKING:
      'juno1l4tcujd4cruakjg5g4ekywcxfp02cula9fx7vmcm6r87srngkfuqz4uhfa',
    VERSION_CONTROL:
      'juno18jmslrz9qhwg3p6wnchrtjldw9c5ut5leuz5pzg8lrdd8nmxn4gqgpk6d2',
  },

  'torii-1': {
    DEX: 'archway1h2pec087m9tegxa7n7um23lda2pj3s2vdxhwpcv53r36an6gmh7sccqlxl',
    IDEA: 'archway1p7qkmfmzymt3yzlgjawyrwl90r54avdan27hw7z9sdx9xvh63gaq7exs0k',
    MEMORY:
      'archway18uz6f7jj92vs0d0r4z4yc7rm06kpkdn3mstfgauxm0lvhkyldyhsslfy43',
    MODULE_FACTORY:
      'archway1qme7y2gefgt4y6ty8y30qp4qn8trdl6pe3c3x3hjchxp4qsz4enqjlgezm',
    OS_FACTORY:
      'archway1dmepjngskg7cpn0hhr46cucx0denx6a542ftqurcl24qh3wlg9gsj26wa4',
    TENDERMINT_STAKING:
      'archway1y4ln2j4uu2qnnda430ew8uskgdcdhf4zeeam5q9u42vacd7wsuuqnjh57q',
    VERSION_CONTROL:
      'archway1zjh2hx0kye0pz8y4hqc2sv06twn7tdylr8xh8qxxzn8afzcfrtvsm6kygn',
    _MANAGER:
      'archway10uynxxd2qeddhxjxxzj5jwyrqe49lwnk9lkah45vpfdk2ejdhgaqhc5pmp',
    _PROXY:
      'archway13fv9hf087p44xn9kw34fzp0sqlhqpzm73t90e3pvg3wz2rc65ezqj00aly',
    _SUBSCRIPTION:
      'archway1zha77mvmmx00dz4ddrwkcrdk0daurdfkwgyn2r2smmg0fwcelzrsxc26ux',
  },
} as const
