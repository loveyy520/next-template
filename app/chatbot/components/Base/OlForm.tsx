import { FC, ReactElement } from 'react';

interface Model {
  [prop: string]: any
}

interface Rule {
  required?: boolean,
  message: string,
  trigger: 'blur' | 'change',
  validator?: (...args: any) => boolean
}

export interface Rules {
  [key: string | number | symbol]: Rule[]
}

interface Props {
    children?: ReactElement[]
    model?: Model,
    rules?: Rules
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

export const OlForm: FC<Props> = ({model = {}, rules = {}, children=[<></>]}) => {
  
  let validateResult = true
  async function validate(): Promise<boolean> {
    children.forEach(async child => {
      if(!child) return
      const { props: {prop, rules: formItemRules} } = child.props
      if (!prop) return
      if (!formItemRules?.length) {
        // formItem没有独立的rules, 使用form的rules
        const existRule = Object.keys(rules).some(ruleKey => ruleKey === prop)
        existRule && (await validateRules(rules[prop], model[prop]))
      } else {
        // formItem有独立的rules
        await validateRules(formItemRules, model[prop])
      }
    })
    return validateResult
  }
  async function validateRules(rules: Rule[], value:any) {
    rules.forEach(async rule => {
      if (rule.required && !value) {
        validateResult = false
      }
      if (rule.validator) {
        assert(typeof rule.validator === 'function', 'Custom validator must be a function')
        validateResult = await rule.validator(value)
      }
    })
  }

  return (
    <form className='flex flex-col items-start justify-start'>
        {children}
    </form>
  );
};