export class Square {

    public side: number;

    constructor(side: number) {
        this.side = side;
    }

    public print(): void {
        console.log(`Square: side = ${this.side}`);
    }
}
