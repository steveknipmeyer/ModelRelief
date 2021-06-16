export class Circle {

    public radius: number;

    constructor(radius: number) {
        this.radius = radius;
    }

    public print(): void {
        console.log(`Circle: radius = ${this.radius}`);
    }
}
