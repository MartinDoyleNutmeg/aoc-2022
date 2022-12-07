class File {
  public readonly name: string;

  public readonly size: number;

  public constructor(name: string, size: number) {
    this.name = name;
    this.size = size;
  }
}

export class Directory {
  public readonly name: string;

  public readonly parent?: Directory;

  public readonly subDirectories: Directory[];

  private readonly files: File[];

  public constructor(name: string, parent?: Directory) {
    this.name = name;
    this.parent = parent;
    this.subDirectories = [];
    this.files = [];
  }

  public get totalSize(): number {
    return (
      this.subDirectories.reduce((acc, child) => acc + child.totalSize, 0) +
      this.files.reduce((acc, file) => acc + file.size, 0)
    );
  }

  public addDir(name: string) {
    this.subDirectories.push(new Directory(name, this));
  }

  public addFile(name: string, size: number) {
    this.files.push(new File(name, size));
  }
}
