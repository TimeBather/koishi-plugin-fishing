export namespace FishingMath{
    export class Variable{

        constructor(protected number:number){
        }

        add(number:number|Variable):void{
            this.number += (typeof number == 'object' && 'getNumber' in number)?number.getNumber():number;
        }

        subtraction(number:number|Variable):void{
            this.number -= (typeof number == 'object' && 'getNumber' in number)?number.getNumber():number;
        }

        multipy(number:number|Variable):void{
            this.number *= (typeof number == 'object' && 'getNumber' in number)?number.getNumber():number;
        }

        divide(number:number|Variable){
            this.number /= (typeof number == 'object' && 'getNumber' in number)?number.getNumber():number;
        }

        getNumber():number{
            return this.number;
        }

        toNumber = this.getNumber
    }
}